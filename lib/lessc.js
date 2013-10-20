module.exports = function compileLess (from, to, config) {
  var cp          = require('child_process'),
    path          = require('path'),
    colors        = require('colors'),
    fs            = require('fs'),
    base          = path.dirname(__dirname),
    nodeBin       = 'node_modules/.bin',
    target,
    self          = this;

  if ( typeof config === 'undefined' ) {
    config = {};
  }

  var spawnArgs = [nodeBin + '/lessc'];

  if ( config.minify || typeof config.minify === 'undefined' ) {
    spawnArgs.push('--yui-compress');
  }

  if ( config.rootPath ) {
    spawnArgs.push('--rootpath=' + config.rootPath);
  }

  spawnArgs.push(from);
  spawnArgs.push(to);

  var Stream = fs.WriteStream(to);

  self.emit('message', { "Compiling LESS": { from: from, to: to, config: config }});

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