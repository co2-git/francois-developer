module.exports = function start (config) {
  if ( typeof config === 'undefined' ) {
    config = {};
  }

  var fs  = require('fs'),
    path  = require('path'),
    cp    = require('child_process'),
    pkg   = require('../package.json'),
    main  = require('../main'),
    
    base      = path.dirname(__dirname),
    out       = fs.createWriteStream(path.join(base, 'server/server.out'), { encoding: 'utf-8' }),
    err       = fs.createWriteStream(path.join(base, 'server/server.err'), { encoding: 'utf-8' }),
    pidFile   = path.join(base, 'server/server.pid'),
    env,
    server,
    self      = this,
    devDir    = path.join(base, 'dev'),
    devLink   = path.join(base, 'public/dev'),
    prodDir   = path.join(base, 'build/app'),
    prodLink  = path.join(base, 'public/app');

  self.on('start server', function startServer () {
    switch ( env ) {
      case 'development':
        fs.unlink(prodLink, function (error) {});
        
        fs.symlink(devDir, devLink, 'dir',
          function (error) {
            if ( error ) {

            }
          });
        break;

      case 'production':
        fs.unlink(devLink, function (error) {});

        fs.symlink(prodDir, prodLink, 'dir',
          function (error) {
            if ( error ) {
              
            }
          });
        break;
    }

    server = cp
      .spawn('node', ['app'], {
        detached: true,
        cwd: base,
        stdio: ['ignore', out, err],
        process: process.env
      })
  
      .on('error', function (error) {
        self.emit('error', error);
      })
  
      .on('close', function (code) {
        self.emit('error', new Error('Server has quit with code ' + code));
      });

    server.unref();

    if ( server.stdout ) {
      server.stdout.on('data', function onServerStdOut (data) {
        self.emit('message.cli', data.toString().grey);
        out.write(data.toString());
      });
      server.stderr.on('data', function onServerStdErr (data) {
        self.emit('message.cli', data.toString().yellow);
        err.write(data.toString());
      });
    }

    self.emit('save pid');
  });

  self.on('error', function onServerError (error) {
    self.emit('message.cli', error.toString().red);
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

    self.emit('message.cli', { env: env });

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
          self.emit('message.cli', 'Already running'.yellow);
          return self.emit('error', new Error('Already running'));
        }
        
        self.emit('start server');
      });
  });

  self.on('save pid', function writePidFile () {
    fs.writeFile(pidFile, server.pid, { flag: 'w+' },
      function onWritePidFile (error) {
        if ( error ) {
          self.emit('message.cli', 'Could not save pid file');
          
          return main('stop', server.pid)
            .on('error', function (error) {
              return self.emit('error', error);
            })
            .on('done', function (status) {
              if ( ! status ) {
                return self.emit('error', new Error('Could not stop misbehaving server.' +
                  'Try following command: kill -9 ' + server.pid));
              }

              self.emit('message.cli', 'Server started but we could not saved PID file '+
                'so we stopped the server');
            });
        } else {
          self.emit('message.cli', 'Server started'.green);

          self.emit('message.cli', { pid: server.pid });

          self.emit('done', { pid: server.pid });
        }
      });
  });

  self.emit('set environment');
};