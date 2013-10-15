#!/usr/bin/env node
var Path = require('path').dirname(__dirname);

module.exports = function path (then) {
  console.log(Path);
  then(null, Path);
};