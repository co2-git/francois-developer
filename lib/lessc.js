module.exports = function compileLess (from, to, minify) {
  var cp          = require('child_process'),
    path          = require('path'),
    colors        = require('colors'),
    fs            = require('fs'),
    base          = path.dirname(__dirname),
    nodeBin       = 'node_modules/.bin',
    target,
    self          = this;

  if ( typeof minify === 'undefined' ) {
    minify = true;
  }

  var spawnArgs = [nodeBin + '/lessc'];

  if ( minify ) {
    spawnArgs.push('--yui-compress');
  }

  spawnArgs.push(from);
  spawnArgs.push(to);

  var Stream = fs.WriteStream(to);

  self.emit('message', { "Compiling LESS": { from: from, to: to, minify: minify }});

  var compileLessToCSS = cp.spawn('node', spawnArgs, { cwd: base });
  
  compileLessToCSS.on('error', function (error) {
    self.emit('error', error);
  });
  
  compileLessToCSS.on('close', function (code) {
    if ( code ) {
      return self.emit('message',
        new Error('Compiling less: unexpected non-zero status: ' + code));
    }
    self.emit('message', ('Less compiled ok: ' + to).green);
    self.emit('done');
  });
  
  compileLessToCSS.stdout.pipe(Stream);
};