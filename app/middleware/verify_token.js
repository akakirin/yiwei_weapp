"use strict"
//const utils = require('../utils/index.js'),

const jwt = require("jsonwebtoken");

module.exports = () => {
  return function *(next) {

    const cert = this.app.config.cert;
    const authorization = this.get('Authorization');
    if('' === authorization){
      this.throw(401,'no token');
    }
    //console.log(authorization);
    const token = authorization.split(' ')[1];
    let tokenContent;
    try{
      tokenContent = jwt.verify(token,cert);
    }catch(err){
      if('TokenExpiredError' === err.name){
        this.throw(401,'token expired');
      }
      this.throw(401,'invalid token')
    }
    console.log('鉴权通过');
    //console.log(tokenContent);
    this.token = tokenContent;
    yield next;
  };
};
