'use strict';

module.exports = () => {
  return function* (next) {
    try {
      yield next;
    } catch (err) {
      this.app.emit('error', err, this);
      console.log(err.message);
      const status = err.status || 500;
      const error = status === 500 && this.app.config.env === 'prod'
        ? 'Internal Server Error'
        : err.message;
      //console.log(error);
      //err.error_message = {error}
      //  console.log(err);
      this.body = {error}

      if (status === 455) {
        this.body.detail = err.errors
      }
      this.status = status;
    }
  };
};
