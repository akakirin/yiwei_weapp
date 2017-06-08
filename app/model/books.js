module.exports = app => {
  const mongoose = app.mongoose;
  const BooksSchema = new mongoose.Schema({
    bookName: String,
    picUrl: String,
    ISBN: {
      type: String,
      unique:true
    },
    author: String,
    category: String,
    summary: String,
    borrow_or_not: {
      type: Number,
      default: 0
    },
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

  BooksSchema.pre('save',function(next) {
    if(this.isNew) {
      this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
      this.meta.updateAt = Date.now();
    }
    next();
  });

  return mongoose.model('Books', BooksSchema);
}
