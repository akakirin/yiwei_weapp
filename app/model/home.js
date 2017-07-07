module.exports = app => {
  const mongoose = app.mongoose;
  const HomeSchema = new mongoose.Schema({
    name: String,
    content: Buffer,
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

  HomeSchema.pre('save', function(next) {
    if (this.isNew) {
      this.meta.createAt = this.meta.updateAt = Date.now()
    }
    else {
      this.meta.updateAt = Date.now()
    }

    next()
  })

  return mongoose.model('Home', HomeSchema);
}
