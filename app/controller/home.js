'use strict';
const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');
const mammoth = require("mammoth");
const sendToWormhole = require('stream-wormhole');
var _ = require('underscore');


module.exports = app => {
  class HomeController extends app.Controller {
    * readtxt() {
      const {ctx} = this;
      const filepath = path.join(ctx.app.baseDir, 'app/public/0602.txt')
      fs.readFile(filepath,'binary',function(err,data){
        if(err){
          console.log(err);
        }else{
          /*var databuf = new Buffer(data,'binary'),
            str = iconv.decode(databuf, 'unicode');
            console.log(str);
          fs.writeFileSync('25.txt',str);*/
          const name = filepath.split('/').pop().split('.')[0],
            content = new Buffer(data,'binary'),
            dataObj = new ctx.model.Home({name,content});
          dataObj.save();
          console.log(name);
        }
      })
    }

    * readword() {
      const {ctx} = this;
      const filepath = path.join(ctx.app.baseDir, 'app/public/2017年it战略人才遴选笔试内容介绍及资料.docx');
      const result = yield mammoth.convertToHtml({path: filepath});
      console.log(result.value);
      ctx.body = result.value;
    }

    * gettxt() {
      const {ctx} = this;
      const databuf = yield ctx.model.Home.findOne({_id:'593cdef3a1a839075d8bb3da'});
      var str = iconv.decode(databuf.content, 'utf-8');
      const name = databuf.name;
      if(str.indexOf('�') != -1){
        str = iconv.decode(databuf.content, 'gbk');
      }
      const re = /^\r*/;;
      console.log(re);
      const filepath = path.join(ctx.app.baseDir, 'app/public/'+databuf.name+'copy.txt');
      fs.writeFileSync(filepath,str);
      ctx.body = {name,str};
    }

    *upload() {
      const {ctx} = this;
      const stream = yield ctx.getFileStream().catch(err=>{
        ctx.body = err.message;
      });
      if(stream){
        const writeFilePath = path.join(ctx.app.baseDir, 'app/public/aa'+stream .filename),
          writeStream = fs.createWriteStream(writeFilePath),
          streamPromise = new Promise(function (resolve, reject) {
            stream.pipe(writeStream);
            stream.on('end', function () {
              /*function transformParagraph(paragraph) {
                var runs = mammoth.transforms.getDescendantsOfType(paragraph, "run");
                var descendants = mammoth.transforms.getDescendants(paragraph);
                var tables = mammoth.transforms.getDescendants(table);
                console.log(runs);
                console.log(descendants);
                console.log(tables);
                return paragraph
              }*/
              function transformElement(element) {
                  var elements = element.children;
                  for(let v of elements) {
                    if(v.type=="table"){
                      console.log(v.children[0].children[0].children[0].children[0].children);
                    }
                  }
                  return element;

              }
              function transformParagraph(paragraph) {
                var runs = mammoth.transforms.getDescendantsOfType(paragraph, "run");
                if(runs.length===0) {
                  var runChild = [{ type: 'run',
                    children: [ { type: 'text', value: ' ' } ],
                    styleId: null,
                    styleName: null,
                    isBold: false,
                    isUnderline: false,
                    isItalic: false,
                    isStrikethrough: false,
                    verticalAlignment: 'baseline',
                    font: null
                  }];

                  paragraph.children = runChild
                  paragraph.styleName = null,
                  paragraph.styleId = "Hello"
                  console.log(paragraph);
                  return paragraph

                }else{
                  return paragraph
                }
              }

              const options = {
                transformDocument: mammoth.transforms.paragraph(transformParagraph),
                //transformDocument: transformElement,
                styleMap: [
                    "p[style-name^='Heading'] => div > h2:fresh",
                    "b => ",
                    "i => ",
                    "p[style-name^='List'] => div > p:fresh",
                    "p.Hello => div.blank:fresh",
                    "p => div > p:fresh"
                ],
                includeDefaultStyleMap: false,
                //ignoreEmptyParagraphs: false
              };
              mammoth.convertToHtml({path: writeFilePath},options).then(docx=>{
                console.log(docx.value)
                const mm = docx.value.replace(/\<div class="blank"\> \<\/div\>/g,'<div class="blank"><br></div>')
                resolve(mm)
              }).catch(err=>{
                reject("文档内容有误")
              });
            });
            stream.on('error',function() {
              reject("文档格式有误")
            })
          });
        yield streamPromise.then(data=>{
          const webdata = data;
          ctx.body = {webdata};
        }).catch(err=>{
          ctx.throw(415,err)
        });
      }



      //ctx.body = result.value;
      //console.log(result.value);

      //const name = 'egg-multipart-test/' + path.basename(stream.filename);
      //console.log(name);

    }

    *uploadtxt() {
      const {ctx} = this;
      const stream = yield ctx.getFileStream().catch(err=>{
        ctx.body = err.message;
      });
      if(stream && stream.filename.split('.')[1]==='txt'){
        const writeFilePath = path.join(ctx.app.baseDir, 'app/public/aa'+stream.filename),
          writeStream = fs.createWriteStream(writeFilePath),
          streamPromise = new Promise(function (resolve, reject) {
            stream.pipe(writeStream);
            stream.on('end', function () {
              fs.readFile(writeFilePath,'binary',function(err,data){
                if(err){
                  console.log(err);
                  reject(err)
                }else{
                  var strtxt = iconv.decode(new Buffer(data,'binary'), 'utf-8');
                  if(strtxt.indexOf('�') != -1){
                    strtxt = iconv.decode(data, 'gbk');
                  }
                  const paragraphs = strtxt.split('\n\n\n'),
                    content = paragraphs.map(item => {
                      let text = item,
                        type = 'paragraph',
                        itemObj = {type,text};
                      return itemObj;
                    }),
                    title = stream.filename.split('.')[0],
                    docObj = new ctx.model.Docs({title,content});
                  docObj.save();
                  //console.log(all);
                  resolve(strtxt);
                }
              })
            });
            stream.on('error',function() {
              reject("文档格式有误")
            })
          });
        yield streamPromise.then(data=>{
          const webdata = data;
          ctx.body = {webdata};
        }).catch(err=>{
          ctx.throw(415,err)
        });
      }else{
        ctx.throw(500,'文档格式有误')
      }
    }

  }
  return HomeController;
};
