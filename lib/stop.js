module.exports = function stop (config) {
  if ( typeof config === 'undefined' ) {
    config = {};
  }

  var fs      = require('fs'),
    path      = require('path'),
    cp        = require('child_process'),
    main      = require('../main'),
    pidFile   = path.dirname(__dirname) + '/server/server.pid',
    pid,
    force     = false,
    self      = this;

  if ( process.env.npm_config_shutdown || config.force ) {
    force = true;
  }

  fs.readFile(pidFile, function (error, data) {
    if ( error ) {
      return self.emit('error', error);
    }

    pid = +data.toString();

    var spawn = cp.spawn('kill', ['-9', pid])
      
      .on('error', function (error) {
        self.emit('error', error);
      })
      
      .on('close', function (code) {
        if ( code ) {
          return self.emit('error', new Error('kill -9 unexpected code ' + code));
        }

        fs.unlink(pidFile, function (error) {
          if ( error ) {
            return self.emit('error', error);
          }

          self.emit('message.cli', 'Server stopped'.green);

          self.emit('done');
        });
      });
  });
};