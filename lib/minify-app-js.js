module.exports = function minifyAppJS () {
  var buildJson = require('../build.json'),
    path = require('path'),
    main = require('../main'),
    base = path.dirname(__dirname),
    self = this,
    uglifiers = [],
    cursor = 0;

  for ( var vendor in buildJson.app ) {
    if ( typeof buildJson.app.uglify === 'object' ) {
      from = path.join(base, buildJson.paths.devApp);

      for ( var jsFile in buildJson.app.uglify ) {
        var input = [];

        if ( buildJson.app.uglify[jsFile] === true ) {
          input.push(path.join(from, jsFile + '.js'));
        }

        uglifiers.push({
          input: input,
          out: path.join(buildJson.paths.app, jsFile + '.min.js')
        });
      }
    }
  }

  uglifiers.forEach(function (uglifier) {
    main('uglify',  uglifier)
      .on('error', function (error) {
        self.emit('error', error);
      })
      .on('done', function () {
        cursor ++;
        if ( cursor === uglifiers.length ) {
          self.emit('done');
        }
      });
  });
};