module.exports = function compileJS (then) {
  var cp      = require('child_process'),
    path      = require('path'),
    colors    = require('colors'),
    fs        = require('fs'),
    requirejs = require('requirejs'),
    base      = path.dirname(__dirname),
    nodeBin   = 'node_modules/.bin',
    target    = 'ui/public/app/vendors/',
    bowerComp = 'ui/public/bower_components/',
    copy      = [bowerComp + 'jquery/jquery.min.js',
                bowerComp + 'bootstrap/docs/assets/js/bootstrap.min.js',
                bowerComp + 'angular/angular.min.js',
                bowerComp + 'angular-ui-router/release/angular-ui-router.min.js',
                bowerComp + 'socket.io-client/dist/socket.io.min.js'];

  console.time('Compile JavaScript');

  console.log(' [.] Compiling JavaScript files');

  console.log(' [.] Copying files already minified by vendor');

  copy.forEach(function forEachCopy (file) {
    var targetFile = target + path.basename(file);
    console.log((' [.] Copying ' + file + ' to ' + targetFile).grey);
    var destination = fs.WriteStream(base + '/' + targetFile);
    var source = fs.ReadStream(base + '/' + file);
    source.pipe(destination);
  });
};