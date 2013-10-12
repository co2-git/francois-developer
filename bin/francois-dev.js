#!/usr/bin/env node
var forever = require('forever'),
  path = require('path'),
  Path = path.dirname(__dirname),
  child = new(forever.Monitor)(Path + '/ui/app.js', {
    'silent': false,
    'pidFile': Path + '/admin/app.pid',
    'watch': true,
    'watchDirectory': Path + '/ui',
    'watchIgnoreDotFiles': true,
    'watchIgnorePatterns': [],
    'logFile': Path + '/admin/forever.log',
    'outFile': Path + '/admin/forever.out',
    'errFile': Path + '/admin/forever.err'
  });
child.start();
forever.startServer(child);