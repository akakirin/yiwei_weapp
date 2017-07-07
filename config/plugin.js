'use strict';

// had enabled by egg
exports.static = true;

exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};

exports.redis = {
  enable: true,
  package: 'egg-redis',
};

exports.weappSDK = {
  enable: true,
  package: 'egg-weapp-sdk',
};

exports.security = {
  enable: false,
  domainWhiteList: ['http://localhost:8080','http://www.akakirin.com','http://www.wukirin.club']
};

exports.cors = {
  enable: true,
  package: 'egg-cors',
};
