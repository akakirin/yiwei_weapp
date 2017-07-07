

module.exports = app => {
  app.beforeStart(function* () {
    const ctx = app.createAnonymousContext(),
      Users = ctx.model.Users,
      Folders = ctx.model.Folders,
      userCount = yield Users.count();
    if(userCount === 0) {
      const userMail = "admin@doclabel.com",
        nickName = userMail.split('@')[0],
        password = "666666",
        userObj = new Users({nickName,userMail,password});
      yield userObj.save();

      console.log("Create admin,Let's do it yo~");
    }else{
      console.log("Data is ready,let's do it yo~");
    }
    const Labels = ctx.model.Labels,
      labelCount = yield Labels.count();
    if(labelCount === 0) {
      const labels = [[3,9],[17,38],[4,15]];
      for(let l of labels) {
        const labelObj = new Labels({
          range: l
        })
        yield labelObj.save();
      }
    }else {
      console.log("labels ready");
    }
  })
};
