module.exports = function compileLess (less, minify, then) {
  var cp          = require('child_process'),
    path          = require('path'),
    colors        = require('colors'),
    fs            = require('fs'),
    base          = path.dirname(__dirname),
    nodeBin       = 'node_modules/.bin',
    target;

  console.time('Compile LESS');

  if ( typeof then !== 'function' && typeof minify === 'function' ) {
    then = minify;
    minify = true;
  }

  if ( typeof less === 'string' ) {
    target = 'ui/public/css/' + path.basename(less).replace(/\.less$/, '.min.css');
  }

  if ( typeof less === 'object' ) {
    target = 'ui/public/css/' + Object.keys(less)[0] + '.min.css';
    less = less[Object.keys(less)[0]];
  }

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
};