module.exports = function build () {
  console.time('Build time');

  var main = require('../main'),
    path = require('path'),
    fs = require('fs'),
    buildJson = require('../build.json'),
    base = path.dirname(__dirname),
    self = this,
    buildCursor = 0;

  if ( ! fs.existsSync(path.join(base, buildJson.paths.app, buildJson.paths.vendors)) ) {
    fs.mkdirSync(path.join(base, buildJson.paths.app, buildJson.paths.vendors));
  }

  for ( var vendor in buildJson.vendors ) {
      if ( ! fs.existsSync(path.join(
        base, buildJson.paths.app, buildJson.paths.vendors, vendor)) ) {
        fs.mkdirSync(path.join(
          base, buildJson.paths.app, buildJson.paths.vendors, vendor));
      }
  }

  var libs = [ 'copy-vendor-js-min', 'compile-vendor-less',
    'copy-vendor-images', 'build-vendor-extra',
    'optimize-app', 'minify-app-js', 'minify-app-css'];
    
  libs.forEach(function (lib) {
      console.time(lib);

      main(lib)
        
        .on('error', function (error) {
          self.emit('message', ('Got error from ' + this.libName).red);
          self.emit('error', error);
        })
        
        .on('done', function () {
          console.timeEnd(this.libName);

          buildCursor ++;

          if ( buildCursor === libs.length ) {
            console.timeEnd('Build time');
            self.emit('done');
          }
        })
        
        .libName = lib;
    });
};