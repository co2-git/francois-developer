module.exports = function stop (config) {
  if ( typeof config === 'undefined' ) {
    config = {};
  }

  var fs      = require('fs'),
    path      = require('path'),
    cp        = require('child_process'),
    pidFile   = path.dirname(__dirname) + '/server/server.pid',
    pid,
    force     = false,
    self      = this;

  if ( process.env.npm_config_shutdown || config.force ) {
    force = true;
  }

  if ( force ) {
    onStatus(null, true);
  }

  else {
    main('status')
      
      .on('error', function (error) {
        self.emit('error', error);
      })
      
      .on('done', function (status) {
        if ( ! status ) {
          self.emit('message', 'Server already stopped');
          return then(null, false);
        }

        self.emit('check if pid file exists');
      });
  }

  self.on('check if pid file exists', function () {
    fs.exists(pidFile, function (exists) {
      if ( exists ) {
        self.emit('get pid');
      }
    });
  });

  function killServerProcess () {
    var spawn = cp.spawn('kill', ['-9', pid])
      
      .on('error', onError)
      
      .on('close', onProcessKillEnd);
  }

  function onError (error) {
    then(error);
  }

  function onPidFileExist (exists) {
    if ( ! exists ) {
      if ( force ) {
        self.emit('message', 'Server already stopped'.yellow);
        return then(null, true);
      }
      return then(null,
        'Status said server is running but pid file is nowhere to be found.' +
          ' * THIS SHOULD NOT HAPPEN *');
    }
    fs.readFile(pidFile, onReadPidFile);
  }

  function onPidFileUnlink (error) {
    if ( error ) {
      return then(error);
    }

    self.emit('message', 'Server stopped'.green);

    then(null, true);
  }

  function onReadPidFile (error, data) {
    if ( error ) {
      return then(error);
    }
    
    pid = +data.toString();

    killServerProcess();
  }

  function onProcessKillEnd (code) {
    if ( code ) {
      self.emit('message', ('`kill -9 ' + pid +'` failed').red);
    }
    
    fs.unlink(pidFile, onPidFileUnlink);
  }
};