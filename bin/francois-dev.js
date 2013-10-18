#!/usr/bin/env node

var action = process.argv[2];

if ( ! action ) {
	action = 'help';
}

try {
  var Action = require('../lib/' + action);

  var Run = Action(
    function onActionDone (error, response) {
      if ( error ) {
        throw error;
      }
    });

  if ( Run && typeof Run === 'object' && typeof Run.onStdio === 'function' ) {
    Run.stdio(function (message) {
      console.log(message);
    });
  }
}

catch (e) {
  require('colors');
  console.log(('Error: action not found: ' + action).red);
}