module.exports = function bowerInstall (then) {
  var cp          = require('child_process'),
    path          = require('path'),
    colors        = require('colors'),
    fs            = require('fs'),
    base          = path.dirname(__dirname) + '/public/dev',
    nodeBin       = path.dirname(__dirname) + '/node_modules/.bin',
    target;

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
      then(new Error(
        'Installing bower dependencies: unexpected non-zero status: ' + code));
    }
    console.log((' [✓] Bower dependencies install').green);
    console.timeEnd('Install bower dependencies');
    var buildTime = console.timeEnd('Build time');
    console.log(' [✓] Built!'.green.bold);
    then(null, buildTime);
  });

  spawn.stderr.on('data', function (data) {
    console.log(data.toString());
  });
};