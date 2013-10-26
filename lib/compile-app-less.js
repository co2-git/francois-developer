module.exports = function compileAppLess () {
  var Import = require('lib-import').setPath(__dirname + '/'),
    path = require('path'),
    base = path.dirname(__dirname),
    self = this;

  Import('lessc', path.join(base, 'dev/less/main.less'),
    path.join(base, 'build/app/css/main.min.css'))

    .on('error', function (error) {
      self.emit('error', error);
    })

    .on('done', function () {
      self.emit('done');
    });
};