module.exports = app => {
  const mongoose = app.mongoose,
    ObjectId = mongoose.Schema.Types.ObjectId;
  const TagsSchema = new mongoose.Schema({
    tags: [],
    creater: {type: ObjectId, ref: 'Users'},
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

  TagsSchema.pre('save',function(next) {
    if(this.isNew) {
      this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
      this.meta.updateAt = Date.now();
    }
    next();
  });

  return mongoose.model('Tags', TagsSchema);
}
