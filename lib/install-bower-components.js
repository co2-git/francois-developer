module.exports = function installBowerComponents () {
  var cp          = require('child_process'),
    path          = require('path'),
    colors        = require('colors'),
    fs            = require('fs'),
    base          = path.dirname(__dirname),
    nodeBin       = 'node_modules/.bin',
    target,
    self          = this;

  self.emit('message', '[.] Installing Bower dependencies');

  var spawn = cp.spawn('node',
    [path.join(base, nodeBin, 'bower'), 'install'],
    { cwd: path.join(base, 'dev') });

  // console.log([path.join(base, 'dev'), 'node', path.join(base, nodeBin, 'bower')].join(' ').bold);

  spawn.on('error', function (error) {
    self.emit('error', error);
  });

  spawn.on('close', function (code) {
    if ( code ) {
      self.emit('message', 'Could not install bower dependencies'.red);

      self.emit('error', new Error(
        'Installing bower dependencies: unexpected non-zero status: ' + code));
    }
    
    self.emit('Bower dependencies install'.green);
    
    self.emit('done');
  });

  spawn.stderr.on('data', function (data) {
    console.log(data.toString());
  });
};