module.exports = function start (config) {
  if ( typeof config === 'undefined' ) {
    config = {};
  }

  var fs  = require('fs'),
    path  = require('path'),
    cp    = require('child_process'),
    pkg   = require('../package.json'),
    main  = require('../main'),
    
    base    = path.dirname(__dirname),
    out     = fs.createWriteStream(path.join(base, 'server/server.out'), { encoding: 'utf-8' }),
    err     = fs.createWriteStream(path.join(base, 'server/server.err'), { encoding: 'utf-8' }),
    pidFile = path.join(base, 'server/server.pid'),
    env,
    server,
    self    = this;

  self.on('start server', function startServer () {
    server = cp.spawn('node', ['app'], {
      detached: true,
      cwd: base,
      // stdio: ['ignore', out, err]
      process: process.env
    });

    server.unref();
    
    server.on('error', function (error) {
      self.emit('error', error);
    });
    server.on('close', onServerClose);

    if ( server.stdout ) {
      server.stdout.on('data', onServerStdOut);
      server.stderr.on('data', onServerStdErr);
    }

    self.emit('save pid');
  });

  function onServerDirExists (exists) {
    if ( ! exists ) {
      return fs.mkdir(path.join(base, 'server'), function (error) {
        if ( error ) {
          return self.emit('error', error);
        }
        main('start');
      });
    }

    self.emit('start server');
  }

  function onServerClose (code) {
    self.emit('error', new Error('Server has quit with code ' + code));
  }

  function onServerStdOut (data) {
    self.emit('message', data.toString().grey);
    out.write(data.toString());
  }

  function onServerStdErr (data) {
    self.emit('message', data.toString().yellow);
    err.write(data.toString());
  }

  self.on('error', function onServerError (error) {
    self.emit('message', error.toString().red);
    main('stop', { force: true });
  });

  self.on('set environment', function setEnv () {
    env = pkg.config.env;

    if ( typeof config === 'object' ) {
      if ( typeof config.env === 'string' ) {
        env = config.env;
      }
    }

    process.env.NODE_ENV = env;

    self.emit('message', { env: env });

    self.emit('build spawn options');
  });

  self.on('build spawn options', function buildSpawnArgs () {
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

    self.emit('get status');
  });

  self.on('get status', function getStatus () {
    main('status')
      .on('error', function (error) {
        self.emit('error', error);
      })
      .on('done', function (status) {
        if ( status ) {
          self.emit('message', 'Already running'.yellow);
          return self.emit('error', new Error('Already running'));
        }
        fs.exists(path.join(base, 'server'), onServerDirExists);
      });
  });

  self.on('save pid', function writePidFile () {
    fs.writeFile(pidFile, server.pid, function onWritePidFile (error) {
      if ( error ) {
        self.emit('message', 'Could not save pid file');
        
        return main('stop', server.pid)
          .on('error', function (error) {
            return self.emit('error', error);
          })
          .on('done', function (status) {
            if ( ! status ) {
              return self.emit('error', new Error('Could not stop misbehaving server.' +
                'Try following command: kill -9 ' + server.pid));
            }

            self.emit('message', 'Server started but we could not saved PID file '+
              'so we stopped the server');
          });
      } else {
        self.emit('message', 'Server started'.green);

        self.emit('message', { pid: server.pid });

        self.emit('done', { pid: server.pid });
      }
    });
  });

  self.emit('set environment');
};