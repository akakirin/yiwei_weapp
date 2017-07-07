module.exports = app => {
  const mongoose = app.mongoose,
    ObjectId = mongoose.Schema.Types.ObjectId;
  const FoldersSchema = new mongoose.Schema({
    name: String,
    creater: {type: ObjectId, ref: 'Users'},
    fatherPath: [],
    childDocs: [{type: ObjectId, ref: 'Docs'}],
    childFolders: [{type: ObjectId, ref: 'Folders'}],
    meta: {
      createAt: {                           // 创建时间
        type: Date,
        default: Date.now()
      },
      updateAt: {                           // 更新时间
        type: Date,
        default: Date.now()
      }
    }
  });

  FoldersSchema.pre('save',function(next) {
    if(this.isNew) {
      this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
      this.meta.updateAt = Date.now();
    }
    next();
  });

  return mongoose.model('Folders', FoldersSchema);
}
