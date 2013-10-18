#!/usr/bin/env node
var actions = ['help', 'version', 'path',
	'build', 'start', 'status',
	'stop', 'update', 'env'];

module.exports = function help(then) {
  console.log('francois-dev { ' + actions.join(' | ') + ' }');
  then(null, actions);
};