'use strict';

module.exports = app => {
  app.get('/api/home',app.controller.home.readtxt);
  app.get('/api/gethome',app.controller.home.gettxt);
  app.get('/api/readword',app.controller.home.readword);
  app.post('/api/upload',app.controller.home.upload);
  app.post('/api/uploadtxt',app.controller.home.uploadtxt);

  //token
  const verifyToken = app.middlewares.verifyToken();
  app.post('/api/login',app.controller.token.create);
  app.get('/api/check',verifyToken,app.controller.token.check);


  //Folder
  app.resources('folder','/api/folder',verifyToken,app.controller.docs.folder);
  //app.resources('users', '/api/v1/users', app.controller.v1.users); // app/controller/v1/users.js

  //Doc
  app.post('/api/doc/upload',verifyToken,app.controller.docs.doc.upload);
  app.delete('/api/doc/:id',verifyToken,app.controller.docs.doc.destroy);
  app.get('/api/doc/:id',verifyToken,app.controller.docs.doc.show);
  app.put('/api/doc/:id',verifyToken,app.controller.docs.doc.label);
};
