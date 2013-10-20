module.exports = function build () {
  console.time('Build time');

  var main = require('../main'),
    path = require('path'),
    fs = require('fs'),
    async = require('async'),
    buildJson = require('../build.json'),
    self = this,
    libs = [
      [ 'build-dir'],
      [ 'install-bower-components',
        'optimize-app',
        'minify-app-js',
        'minify-app-css'],
      
      [ 'copy-vendor-js-min',
        'compile-vendor-less',
        'copy-vendor-images',
        'build-vendor-extra',
        'minify-vendor-js']
      ],
    flow = {};

  libs.forEach(function (group, i) {
    flow['group' + (i+1)] = function (serieCallback) {
      var parallels = {};

      group.forEach(function (lib) {
        parallels[lib] = function (parallelCallback) {
          self.emit('message', lib);
          main(lib)
            .on('error', function (error) {
              self.emit('message', lib.red);
              parallelCallback(error);
            })
            .on('done', function () {
              self.emit('message', lib.green);
              parallelCallback(null, true);
            });
        };
      });

      async.parallel(parallels, function (error, results) {
        if ( error ) {
          return self.emit('error', error);
        }
        else {
          serieCallback();
        }
      });
    };
  });

  async.series(flow, function (error, results) {
    if ( error ) {
      return self.emit('error');
    }
  });
};