module.exports = function optimize () {
  var buildJson = require('../build.json'),
    path = require('path'),
    cp = require('child_process'),
    base = path.dirname(__dirname),
    self = this;

  var optimizer = cp.spawn('node', ['node_modules/.bin/r.js', '-o', 'build.js'], {
    cwd: base
  });

  optimizer.on('error', function onOptimizeError (error) {
    self.emit('error', error);
  });

  optimizer.on('close', function onOptimizeClose (code) {
    if ( code ) {
      console.log(['node_modules/.bin/r.js', '-o', 'build.js'].join(' ').bold);
      return self.emit('error', new Error('r.js closed with error: ' + code));
    }
    self.emit('done');
  });
};