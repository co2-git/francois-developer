#!/usr/bin/env node
var cp          = require('child_process'),
  path          = require('path'),
  colors        = require('colors'),
  fs            = require('fs'),
  base          = path.dirname(__dirname),
  nodeBin       = 'node_modules/.bin',
  lessFiles     = ['ui/public/bower_components/bootstrap/less/bootstrap.less',
    'ui/public/bower_components/bootstrap/less/responsive.less'],
  lessFilesCur  = 0,
  next;



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

function compileLess (less, minify, then) {
  console.time('Compile LESS');

  if ( typeof then !== 'function' && typeof minify === 'function' ) {
    then = minify;
    minify = true;
  }

  var target = 'ui/public/css/' + path.basename(less).replace(/\.less$/, '.min.css');

  var spawnArgs = [nodeBin + '/lessc'];

  if ( minify ) {
    spawnArgs.push('--yui-compress');
  }

  spawnArgs.push(less);
  spawnArgs.push(target);

  var Stream = fs.WriteStream(target);

  console.log((' [.] Compiling ' + less + ' to ' + target + ' { minify: ' + minify + ' }').grey);

  var compileLessToCSS = cp.spawn('node', spawnArgs, { cwd: base });
  
  compileLessToCSS.on('error', function (error) {
    console.log(('Could not compile ' + less).red);
    then(error);
  });
  
  compileLessToCSS.on('close', function (code) {
    if ( code ) {
      console.log(('Could not compile ' + less).red);
      return then(new Error('Compiling less: unexpected non-zero status: ' + code));
    }
    console.log((' [✓] Less compiled ok: ' + target).green);
    then();
  });
  
  compileLessToCSS.stdout.pipe(Stream);
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
              bowerInstall();
            }
          }
        });
      });
  });
}

function bowerInstall () {
  console.time('Install bower dependencies');

  console.log(' [.] Installing Bower dependencies');

  var spawnArgs = [nodeBin + '/bower', 'install'];

  var spawn = cp.spawn('node', spawnArgs, { cwd: base });

  spawn.on('error', function (error) {
    throw error;
  });

  spawn.on('close', function (code) {
    if ( code ) {
      console.log(('Could not install bower dependencies').red);
      throw new Error('Installing bower dependencies: unexpected non-zero status: ' + code);
    }
    console.log((' [✓] Bower dependencies install').green);
    console.timeEnd('Install bower dependencies');
    var buildTime = console.timeEnd('Build time');
    console.log(' [✓] Built!'.green.bold);
    next(null, buildTime);
  });
}


module.exports = function build (then) {
  next = then;

  console.time('Build time');

  console.log(' [.] Compiling less files');

  lessFiles.forEach(function (lessFile) {
    compileLess(lessFile, onLessCompressed);
  });
};