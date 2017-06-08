'use strict';

module.exports = app => {
  class BooksService extends app.Service {

    constructor(ctx) {
      super(ctx);
      this.models = this.ctx.model;
      this.root = 'https://api.douban.com/v2/book/isbn/';
    }

    * request(url,opts) {
      url = `${this.root}${url}`;
      opts = Object.assign({
        dataType: 'json',
      }, opts);
      return yield this.ctx.curl(url,opts);
    }

    * createbooks(isbn) {
      const result = yield this.request(isbn);
      return result;
    }

    checkSuccess(result) {
      if (result.status !== 200) {
        const errorMsg = result.data && result.data.msg ? result.data.msg : 'unknown error';
        this.ctx.throw(result.status, errorMsg);
      }
    }

  }
  return BooksService;
};
