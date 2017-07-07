'use strict';
const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');

module.exports = app => {
  class DocController extends app.Controller {

    *label() {
      const {ctx} = this;
      const Docs = ctx.model.Docs,
        docId = ctx.params.id,
        labelInfo = ctx.request.body;

    }

    *show() {
      const {ctx} = this;
      const Docs = ctx.model.Docs,
        docId = ctx.params.id;
      const docInfo = yield Docs.findOne({_id:docId},{name:1,content:1})
        .populate([{
          path: 'content.labels',
          select: 'tag range'
        },
        {
          path: 'taglist',
          select: 'tags creater'
        }]);
      console.log(docInfo.taglist);
      //console.log(docInfo.content[0].labels);
      /*for(let item of docInfo.content) {
        const ranges = item.labels.map(label => {
          return label.range;
        })
        var cssranges = [...ranges]

      }*/
      ctx.status = 200;
      ctx.body = {
        success: true,
        data: {
          name: docInfo.name,
          content: docInfo.content,
          taglist: docInfo.taglist
        }
      }
    }

    * upload() {
      const {ctx} = this;
      const stream = yield ctx.getFileStream().catch(err=>{
        ctx.body = err.message;
      });
      const creater= ctx.token.uid,
        father= ctx.query.father,
        Docs= ctx.model.Docs;
      console.log(father);
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
                  resolve(strtxt);
                }
              })
            });
            stream.on('error',function() {
              reject("文档格式有误")
            })
          });
        const uploadTxt = yield streamPromise.catch(err => {
          ctx.throw(401,'文档格式有误')
        })
        const paragraphs = uploadTxt.split('\n\n\n\n');
        var content = paragraphs.map(item => {
            return {
              text: item
            };
          }),
          name = stream.filename.split('.')[0],
          docObj = new Docs({name,creater,content});
        var docId = "";
        yield docObj.save().then(data => docId= data._id).catch(err => {
          ctx.throw(500,'上传失败，请重新上传')
        });
        if(father) {
          const Folders = ctx.model.Folders;
          yield Folders.update({_id:father},{$addToSet : { childDocs: docId }})
        }else {
          const Users = ctx.model.Users;
          yield Users.update({_id:creater},{$addToSet : { docs: docId }});
        }

        ctx.status = 200;
        ctx.body = {
          success: true,
          message: '创建成功',
          docId: docId
        };
      }else{
        ctx.throw(500,'文档格式有误')
      }
    }

    *destroy() {
      const {ctx} = this;
      const docId = ctx.params.id,
        father= ctx.query.father,
        Docs = ctx.model.Docs;
      if(father) {
        const Folders = ctx.model.Folders;
        yield Folders.update({_id:father},{$pull:{childDocs:docId}});
      }else {
        const Users = ctx.model.Users;
        yield Users.update({_id:ctx.token.uid},{$pull:{docs:docId}});
      }
      yield Docs.remove({_id:docId});
      ctx.status = 200;
      ctx.body = {
        success: true,
        message: '删除成功'
      }
    }


  }
  return DocController;
}
