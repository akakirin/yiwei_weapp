module.exports = app => {
  const mongoose = app.mongoose,
    ObjectId = mongoose.Schema.Types.ObjectId;
  const LabelsSchema = new mongoose.Schema({
    //tag: {type: ObjectId, ref: 'Tags'},
    //creater: {type: ObjectId, ref: 'Users'},
    tag: {
      type: String,
      default: 'fuck'
    },
    range: [],
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

  LabelsSchema.pre('save',function(next) {
    if(this.isNew) {
      this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
      this.meta.updateAt = Date.now();
    }
    next();
  });

  return mongoose.model('Labels', LabelsSchema);
}
