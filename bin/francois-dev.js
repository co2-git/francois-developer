#!/usr/bin/env node

require('colors');

var main = require('../main');
var action = process.argv[2];
var json = require('../package.json');
var config = {};
var regex = /^npm_config_app_(.+)$/;

if ( ! action ) {
	action = 'help';
}

for ( var k in process.env ) {
  if ( regex.test(k) ) {
    config[k.replace(regex, '$1')] = process.env[k];
  }
}

main(action, config)
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