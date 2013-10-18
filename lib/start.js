module.exports = function start (config, then) {
  if ( typeof config === 'function' && typeof then !== 'function' ) {
    then = config;
    config = {};
  }

  var fs  = require('fs'),
    path  = require('path'),
    cp    = require('child_process'),
    pkg   = require('../package.json'),
    
    base    = path.dirname(__dirname),
    out     = fs.createWriteStream(base + '/server/server.out', { encoding: 'utf-8' }),
    err     = fs.createWriteStream(base + '/server/server.err', { encoding: 'utf-8' }),
    pidFile = base + '/server/server.pid',
    env,
    server;

  function startServer () {
    server = cp.spawn('node', ['app'], {
      detached: true,
      cwd: base,
      // stdio: ['ignore', out, err]
      process: process.env
    });

    server.unref();
    
    server.on('error', onServerError);
    server.on('close', onServerClose);

    if ( server.stdout ) {
      server.stdout.on('data', onServerStdOut);
      server.stderr.on('data', onServerStdErr);
    }

    writePidFile();

    console.log('Server started'.green, { pid: server.pid });

    then(null, { pid: server.pid });
  }

  function setEnv () {
    env = pkg.config.env;

    if ( typeof config === 'object' ) {
      if ( typeof config.env === 'string' ) {
        env = config.env;
      }
    }

    process.env.NODE_ENV = env;
  }

  function buildSpawnArgs () {
    var argRegEx = /^\-\-(.+)=(.+)$/;

    process.argv.forEach(function (arg, i) {
      if ( i > 2 && arg.match(argRegEx) ) {
        var key = arg.replace(argRegEx, '$1'),
          value = arg.replace(argRegEx, '$2');

        if ( key === 'env' ) {
          env = value;
        }
      }
    });
  }

  function getStatus () {
    var status = require('./status');

    status(function onStatus (error, status) {
      if ( error ) {
        return then(error);
      }
      
      if ( status ) {
        console.log('Already running'.yellow);
        return then(new Error('Already running'));
      }

      fs.exists(base + '/server', onServerDirExists);
    });
  }

  function onServerError (error) {
    console.log(error.toString().red);
    require('stop')({ force: true });
  }

  function onServerClose (code) {
    console.log('arr');
    onServerError(new Error('Server has quit with code ' + code));
  }

  function onServerStdOut (data) {
    console.log(data.toString().grey);
    out.write(data.toString());
  }

  function onServerStdErr (data) {
    console.log(data.toString().yellow);
    err.write(data.toString());
  }

  function writePidFile () {
    fs.writeFile(pidFile, server.pid, onWritePidFile);
  }

  function onWritePidFile (error) {
    if ( error ) {
      console.log('could not save pid file');
      return require('./stop')(server.pid, function (error, status) {
        if ( error ) {
          return then(error);
        }

        if ( ! status ) {
          return then(new Error('Could not stop misbehaving server.' +
            'Try following command: kill -9 ' + server.pid));
        }

        console.log('Server started but we could not saved PID file so we stopped the server');
      });
    }
  }

  function onServerDirExists (exists) {
    if ( ! exists ) {
      return fs.mkdir(base + '/server', function (error) {
        if ( error ) {
          return then(error);
        }
        start(then);
      });
    }

    startServer();
  }

  setEnv();
  buildSpawnArgs();
  getStatus();
};