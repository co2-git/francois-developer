#!/usr/bin/env node

require('colors');

var main = require('../main');
var action = process.argv[2];
var json = require('../package.json');

if ( ! action ) {
	action = 'help';
}

main(action)
  .on('message', function (message) {
    console.log(message);
  })

  .on('error', function (error) {
    throw error;
  })

  .on('done', function (done) {
    console.log();
    console.log(('francois-dev v' + json.version).grey);
  });