'use strict';

module.exports = app => {
  class FolderController extends app.Controller {
    * index() {
      const {ctx} = this;
      const userId = ctx.token.uid,
        Users = ctx.model.Users;
      const filesInfo = yield Users.findOne({_id:userId},{folders:1,docs:1})
        .populate([
          {path:'folders', select: 'name'},
          {path:'docs', select: 'name'}
        ]),
        folderFiles = filesInfo.folders.map((folder) => {
          return {
            _id: folder._id,
            name: folder.name,
            url: '/folder/'+folder._id
          }
        }),
        docFiles = filesInfo.docs.map((doc) => {
          return {
            _id: doc._id,
            name: doc.name,
            url: '/doc/'+doc._id
          }
        });
      const files = folderFiles.concat(docFiles);
      console.log(files);
      ctx.status = 200;
      ctx.body = {
        success: true,
        data: files
      };
    }

    * create() {
      const {ctx} = this;
      const creater = ctx.token.uid,
        createInfo = ctx.request.body,
        name = createInfo.name,
        Users = ctx.model.Users,
        Folders = ctx.model.Folders,
        folderObj = new Folders({name,creater});
      var folderId = '';
      yield folderObj.save().then(data => folderId = data._id);
      console.log(folderId);
      if(!createInfo.father) {
        yield Users.update({_id:creater},{$addToSet : { folders: folderId }});
      }else{
        const fatherFolder = yield Folders.findOne({_id:createInfo.father});
        if(fatherFolder.creater != creater) {
          ctx.throw(401,'没有此文件操作权限')
        }else{
          yield Folders.update({_id:createInfo.father},{$addToSet : { childFolders: folderId }});
          const fatherNow = fatherFolder.fatherPath;
          fatherNow.push({
            name: fatherFolder.name,
            id: fatherFolder._id
          });
          yield Folders.update({_id:folderId},{$set:{fatherPath:fatherNow}});
        }
      }
      ctx.status = 200;
      ctx.body = {
        success: true,
        message: '创建成功',
        folderId: folderId
      };
    }

    * show() {
      const {ctx} = this;
      const folderId = ctx.params.id,
        Folders = ctx.model.Folders;
      const folderInfo = yield Folders.findOne({_id:folderId})
      .populate([
        {path:'childDocs', select: 'name '},
        {path:'childFolders', select: 'name'}
      ]),
        folderFiles = folderInfo.childFolders.map((folder) => {
          return {
            _id: folder._id,
            name: folder.name,
            url: '/folder/'+folder._id
          }
        }),
        docFiles = folderInfo.childDocs.map((doc) => {
          return {
            _id: doc._id,
            name: doc.name,
            url: '/doc/'+doc._id
          }
        }),
        files = folderFiles.concat(docFiles);
      if(ctx.token.uid != folderInfo.creater) {
        ctx.throw(401,'无查看此文件夹权限')
      }
      ctx.status = 200;
      ctx.body = {
        success: true,
        data: {
          name: folderInfo.name,
          creater: folderInfo.creater,
          fatherPath: folderInfo.fatherPath,
          files: files
        }
      }
    }

    * destroy() {
      const {ctx} = this;
      const folderId = ctx.params.id,
        Folders = ctx.model.Folders,
        Docs = ctx.model.Docs,
        Users = ctx.model.Users;
      const folderInfo = yield Folders.findOne({_id:folderId},{fatherPath:1,childFolders:1,childDocs:1}),
        fatherPath = folderInfo.fatherPath;
        console.log(fatherPath);
      const fatherNow = fatherPath[fatherPath.length-1];
      if(fatherNow) {
        yield Folders.update({_id:fatherNow.id},{$pull:{childFolders:folderId}})
      }else{
        yield Users.update({_id:ctx.token.uid},{$pull:{folders:folderId}});
      }
      yield Folders.remove({_id:folderId});
      yield Docs.remove({_id:{$in:folderInfo.childDocs}});
      yield Folders.remove({_id:{$in:folderInfo.childFolders}});
      ctx.status = 200;
      ctx.body = {
        success: true,
        message: '删除成功'
      }
    }


  }
  return FolderController;
}
