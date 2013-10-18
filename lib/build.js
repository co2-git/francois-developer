#!/usr/bin/env node
var cp              = require('child_process'),
  path              = require('path'),
  colors            = require('colors'),
  fs                = require('fs'),
  base              = path.dirname(__dirname),
  nodeBin           = 'node_modules/.bin',
  lessFiles         = ['ui/public/bower_components/bootstrap/less/bootstrap.less',
    { 'bootstrap-responsive': 'ui/public/bower_components/bootstrap/less/responsive.less'}],
  lessFilesCur      = 0,
  next,
  compileLess       = require('./compile-less'),
  bowerInstall      = require('./bower-install'),
  compileJavaScript = require('./compile-js');

function onLessCompressed (error) {
  if ( error ) {
    throw error;
  }
  lessFilesCur ++;
  if ( lessFilesCur >= lessFiles.length ) {
    console.log(' [✓] Less files compressed'.green);
    console.timeEnd('Compile LESS');
    copyImages();
  }
}

function copyImages () {
  console.time('Copy images');
  console.log(' [.] Copying images');

  var dirs = ['/ui/public/bower_components/bootstrap/img'];

  var dirCursor = 0;

  dirs.forEach(function (dir) {
    fs.readdir(base + dir,
      function (error, files) {
        if ( error ) {
          throw error;
        }
        var cursor = 0;
        files.forEach(function (file) {
          console.log((' [.] Copying image ' + file).grey);

          fs.createReadStream(base + dir + '/' + file)
            .pipe(fs.createWriteStream(base + '/ui/public/img/' + file));
          console.log((' [✓] Image copyied ok: ' + file).green);
          cursor ++;
          if ( cursor === files.length ) {
            dirCursor ++;
            if ( dirCursor === dirs.length ) {
              console.log((' [✓] Copying images ok').green);
              console.timeEnd('Copy images');
              compileJavaScript();
            }
          }
        });
      });
  });
}

module.exports = function build (then) {
  next = then;

  console.time('Build time');

  bowerInstall(function onBowerInstall (error) {
    if ( error ) {
      throw error;
    }
    
    console.log(' [.] Compiling less files');

    lessFiles.forEach(function compileLessFile (lessFile) {
      compileLess(lessFile, onLessCompressed);
    });
  });
};