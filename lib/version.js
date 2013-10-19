var packageJson = require(__dirname + '/../package.json');

module.exports = function version(then) {
  this.emit('message', packageJson.version);
  this.emit('done', packageJson.version);
};