'use strict';

module.exports = appInfo => {
  const config = {};

  // should change to your own
  config.keys = appInfo.name + '_1495074913022_9577';

  config.cert = 'docLabel_by_akakirin_1495074913022_9577';

  // add your config here
  config.mongoose = {
    url: 'mongodb://127.0.0.1/docLabel',
    options: {}
  }

  config.multipart = {
    whitelist: [ '.xlsx','.xls','.txt','.csv'],
  }

  config.security = {
    domainWhiteList: ['http://localhost:8080','http://localhost:8081']
  };

  config.cors = {
    credentials: true
  }

  config.middleware = [ 'errorHandler' ];

  config.errorHandler = {
    // 非 `/api/` 路径不在这里做错误处理，留给默认的 onerror 插件统一处理
    match: '/api',
  };

  return config;
};
