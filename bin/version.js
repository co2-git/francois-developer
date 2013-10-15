#!/usr/bin/env node
var packageJson = require(__dirname + '/../package.json');

module.exports = function version(then) {
  console.log(packageJson.version);
  then(null, packageJson.version);
};