'use strict';

const jwt = require('jsonwebtoken')

module.exports = app => {
  class TokenController extends app.Controller {
    * create() {
      const {ctx} = this;
      const userInfo = ctx.request.body,
        Users = ctx.model.Users,
        userLogin = yield Users.findOne({userMail:userInfo.userMail},{nickName:1,userMail:1,password:1});
      console.log(userInfo);
      if(userLogin) {
        if(userLogin.password === userInfo.password) {
          const token = jwt.sign({
            uid: userLogin._id,
            exp: Math.floor(Date.now()/1000) + 24 * 60 * 60 * 7//7 days
          },app.config.cert);
          console.log(token)
          ctx.status = 200;
          ctx.body = {
            success:true,
            data:{
              uid:userLogin._id,
              name:userLogin.nickName,
              token,
            }
          };
        }else {
          ctx.throw(401,'密码错误')
        }
      }else {
        ctx.throw(401,'用户不存在')
      }
    }

    * check() {
      const {ctx} = this;
      ctx.status = 200;
      ctx.body = ctx.token
    }
  }
  return TokenController;
}
