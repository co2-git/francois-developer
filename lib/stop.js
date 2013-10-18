module.exports = function stop (config, then) {
  if ( typeof config === 'function' && typeof then === 'undefined' ) {
    then = config;
    config = {};
  }

  require('colors');

  var fs      = require('fs'),
    path      = require('path'),
    cp        = require('child_process'),
    getStatus = require('./status'),
    pidFile   = path.dirname(__dirname) + '/server/server.pid',
    pid,
    force     = false;

  if ( process.env.npm_config_shutdown || config.force ) {
    force = true;
  }

  if ( force ) {
    onStatus(null, true);
  } else {
    getStatus(onStatus);
  }

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
        console.log('Server already stopped'.yellow);
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

    console.log('Server stopped'.green);

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
      console.log(('`kill -9 ' + pid +'` failed').red);
    }
    
    fs.unlink(pidFile, onPidFileUnlink);
  }

  function onStatus (error, status) {
    if ( error ) {
      return then(error);
    }
    
    if ( ! status ) {
      console.log('Server already stopped');
      return then(null, false);
    }

    fs.exists(pidFile, onPidFileExist);
  }
};