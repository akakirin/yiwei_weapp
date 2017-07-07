module.exports = app => {
  const mongoose = app.mongoose,
    ObjectId = mongoose.Schema.Types.ObjectId;
  const DocsSchema = new mongoose.Schema({
    name: String,
    creater: {type: ObjectId, ref: 'Users'},
    content: [{
      text: String,
      labels: [{
        type: ObjectId,
        ref: 'Labels'
      }]
    }],
    taglist: {type: ObjectId, ref: 'Tags'},
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

  DocsSchema.pre('save',function(next) {
    if(this.isNew) {
      this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
      this.meta.updateAt = Date.now();
    }
    next();
  });

  return mongoose.model('Docs', DocsSchema);
}
