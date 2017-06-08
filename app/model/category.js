module.exports = app => {
  const mongoose = app.mongoose,
    ObjectId = mongoose.Schema.Types.ObjectId;
  const CategorySchema = new mongoose.Schema({
    name: String,
    books: [{type: ObjectId, ref: 'Books'}],
    meta: {
      createAt: {
        type: Date,
        default: Date.now()
      },
      updateAt: {
        type: Date,
        default: Date.now()
      }
    }
  })

  CategorySchema.pre('save', function(next) {
    if (this.isNew) {
      this.meta.createAt = this.meta.updateAt = Date.now()
    }
    else {
      this.meta.updateAt = Date.now()
    }

    next()
  })

  return mongoose.model('Category', CategorySchema);
}
