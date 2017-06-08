'use strict';

module.exports = appInfo => {
  const config = {};

  // should change to your own
  config.keys = appInfo.name + '_1495074913022_9577';

  // add your config here
  config.mongoose = {
    url: 'mongodb://10.141.139.233/yiweiv3',
    options: {}
  }
  return config;
};
