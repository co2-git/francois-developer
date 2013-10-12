#!/usr/bin/env node

var action = process.argv[2],
  defaultAction = 'help';

if ( ! action ) {
  action = defaultAction;
}

var actions = {
  help: function help () {
    console.log('francois-developer');
    console.log({ actions: Object.keys(actions) });
  },
  
  start: function start () {
    var forever = require('forever'),
      path = require('path'),
      Path = path.dirname(__dirname),
      child = new(forever.Monitor)(Path + '/ui/app.js', {
        'silent': false,
        'pidFile': Path + '/admin/app.pid',
        'watch': true,
        'watchDirectory': Path,
        'watchIgnoreDotFiles': true,
        'watchIgnorePatterns': ['admin/*'],
        'logFile': Path + '/admin/forever.log',
        'outFile': Path + '/admin/forever.out',
        'errFile': Path + '/admin/forever.err'
      });
    child.start();
    forever.startServer(child);
  },

  status: function status () {
    var forever = require('forever'),
      appStatus = 'stopped',
      path = require('path'),
      Path = path.dirname(__dirname);
    forever.list(null, function (error, list) {
      if ( error ) {
        throw error;
      }
      list.forEach(function (p) {
        if ( p.command === Path + '/ui/apps.js' ) {
          appStatus = 'running';
        }
      });
      console.log(appStatus);
    });
  }
};

if ( typeof actions[action] !== 'function' ) {
  console.log('Unknown action', action, 'Using default action', defaultAction);
  action = defaultAction;
}

actions[action]();

  




// node node_modules/.bin/forever -w start ui/app.js