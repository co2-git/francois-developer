#!/usr/bin/env node

module.exports = function status (then) {
  require('colors');

  var fs      = require('fs'),
    path      = require('path'),
    pidFile   = path.dirname(__dirname) + '/admin/forever.pid';

  fs.exists(pidFile, function (exists) {
    if ( ! exists ) {
      console.log('Stopped'.red);
      then(null);
    } else {
      fs.readFile(pidFile, function (error, data) {
        if ( error ) {
          return then(error);
        }
        var $status = { pid: data } ;
        console.log('Running'.green, $status);
        then(null, $status);
      });
    }
  });
};