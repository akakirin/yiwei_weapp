'use strict';

module.exports = app => {
  class BooksController extends app.Controller {
    * index() {
      const {ctx} = this;
      ctx.body = yield ctx.model.Books.find({});
    }

    * listwithcat() {
      const {ctx} = this;
      ctx.body = yield ctx.model.Category.find().select('name books').populate('books','bookName picUrl',null,{sort: { bookName: 1 }});
    }

    * show() {
      const {ctx} = this;
      ctx.body = yield ctx.model.Books.findOne({_id:ctx.params.id});
    }


  }
  return BooksController;
};
