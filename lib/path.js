var Path = require('path').dirname(__dirname);

module.exports = function path (then) {
  this.emit('message', Path);
  this.emit('done', Path);
};