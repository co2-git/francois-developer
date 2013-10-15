module.exports = function start (config, then) {
  if ( typeof config === 'function' && typeof then !== 'function' ) {
    then = config;
    config = {};
  }

  var fs = require('fs'),
    path = require('path'),
    base = path.dirname(__dirname),
    pkg = require('../package.json');

  var env = pkg.config.env;

  if ( typeof config === 'object' ) {
    if ( typeof config.env === 'string' ) {
      env = config.env;
    }
  }

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

  console.log('Environment: ' + env);

  require('./status')(function (error, status) {
    if ( error ) {
      return then(error);
    }
    
    if ( status ) {
      console.log('Already running'.yellow);
      return then(new Error('Already running'));
    }

    fs.exists(base + '/admin', function (exists) {
      if ( ! exists ) {
        return fs.mkdir(base + '/admin', function (error) {
          if ( error ) {
            return then(error);
          }
          start(then);
        });
      }

      
    });
  });
};