module.exports = function status () {
  var fs      = require('fs'),
    path      = require('path'),
    cp        = require('child_process'),
    pidFile   = path.dirname(__dirname) + '/server/server.pid',
    self      = this;

  fs.readFile(pidFile, function (error, data) {
    if ( error ) {
      if ( error.code === 'ENOENT' ) {
        self.emit('message', 'Stopped'.yellow);
        return self.emit('done', false);
      }
      
      return self.emit('error', error);
    }

    var $status = { pid: +data.toString() } ;
    
    /* Check that pid exists */

    var ps = cp.spawn('ps', [$status.pid]);

    ps.on('error', function (error) {
      self.emit('error', error);
    });

    ps.on('close', function (code) {
      if ( code ) {
        self.emit('message', 'Zombie alert! Server is dead but pretends to be alive.'.red);
        self.emit('message', 'Doing some zombie housecleaning');
        fs.unlink(pidFile, function (error) {
          if ( error ) {
            self.emit('message', 'Could not kill zombie.'.red);
            return self.emit('error', error);
          }
          else {
            self.emit('message', 'Zombie killed OK'.green);
            self.emit('message', 'Stopped'.red);
          }
        });
      }
      else {
        self.emit('message', 'Running'.green, $status);
        self.emit('done', $status);
      }
    });
  });
};