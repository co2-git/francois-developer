module.exports = function status (then) {
  require('colors');

  var fs      = require('fs'),
    path      = require('path'),
    cp        = require('child_process'),
    pidFile   = path.dirname(__dirname) + '/server/server.pid';

  fs.exists(pidFile, function (exists) {
    if ( ! exists ) {
      console.log('Stopped'.red);
      then(null);
    } else {
      fs.readFile(pidFile, function (error, data) {
        if ( error ) {
          return then(error);
        }

        var $status = { pid: +data.toString() } ;
        
        /* Check that pid exists */

        var ps = cp.spawn('ps', [$status.pid]);

        ps.on('error', function (error) {
          then(error);
        });

        ps.on('close', function (code) {
          if ( code ) {
            console.log('Zombie alert! Server is dead but pretends to be alive.'.red);
            console.log('Doing some zombie housecleaning');
            fs.unlink(pidFile, function (error) {
              if ( error ) {
                console.log('Could not kill zombie.'.red);
                return then(error);
              }
              else {
                console.log('Zombie killed OK'.green);
                console.log('Stopped'.red);
              }
            });
          }
          else {
            console.log('Running'.green, $status);
            then(null, $status);
          }
        });
      });
    }
  });
};