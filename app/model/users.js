module.exports = app => {
  const mongoose = app.mongoose,
    ObjectId = mongoose.Schema.Types.ObjectId;
  const UsersSchema = new mongoose.Schema({
    nickName :{
      type: String,
      default: ''
    },
    userMail :{
      type: String,
      unique: true
    },
    password :String,
    docs: [{type: ObjectId, ref: 'Docs'}],
    folders: [{type: ObjectId, ref: 'Folders'}],
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

  UsersSchema.pre('save',function(next) {
    if(this.isNew) {
      this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
      this.meta.updateAt = Date.now();
    }
    next();
  });

  return mongoose.model('Users', UsersSchema);
}
