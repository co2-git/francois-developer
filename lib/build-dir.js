module.exports = function buildDir () {
  var fs = require('fs'),
    path = require('path'),
    base = path.dirname(__dirname),
    buildJson = require('../build.json'),
    self = this;

  mkdir(path.join(base, 'build'));
  mkdir(path.join(base, 'build', 'app'));
  mkdir(path.join(base, 'build', 'app', 'css'));
  mkdir(path.join(base, 'build', 'app', 'vendor'));

  for (  var vendor in buildJson.vendors ) {
    mkdir(path.join(base, 'build', 'app', 'vendor', vendor));
    mkdir(path.join(base, 'build', 'app', 'vendor', vendor, 'css'));
    mkdir(path.join(base, 'build', 'app', 'vendor', vendor, 'js'));
    mkdir(path.join(base, 'build', 'app', 'vendor', vendor, 'img'));
  }

  mkdir(path.join(base, 'server'));

  self.emit('done');

  function mkdir (dir, then) {
    try {
      fs.mkdirSync(dir);
    } catch ( error ) {
      if ( error && error.code !== 'EEXIST' ) {
          return self.emit('error', error);
        }
    }
  }
};