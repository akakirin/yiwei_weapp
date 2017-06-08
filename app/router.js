'use strict';

module.exports = app => {
  //app.resources('home','/api/home', app.controller.home);
  app.resources('books', '/api/books', app.controller.books);
  //app.get('books/withcat',app.controller.books.listwithcat);
  app.get('/api/bookswithcat',app.controller.books.listwithcat);
  //app.resources('users', '/api/v1/users', app.controller.v1.users); // app/controller/v1/users.js
};
