#!/usr/bin/env node

var action = process.argv[2];

if ( ! action ) {
	action = 'help';
}

var Action = require('./' + action);

Action(function (error, response) {
	if ( error ) {
		throw error;
	}
});