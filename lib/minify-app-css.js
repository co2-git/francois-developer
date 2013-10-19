module.exports = function minifyAppCSS () {
  var clean = require('clean-css'),
    main = require('../main'),
    fs = require('fs'),
    path = require('path'),
    base = path.dirname(__dirname),
    buildJson = require('../build.json'),
    target = path.join(base, buildJson.paths.app, 'css'),
    source = path.join(base, buildJson.paths.devCSS),
    file,
    self = this;

  fs.exists(target, function (exists) {
    if ( ! exists ) {
      return fs.mkdir(target, function (error) {
        if ( error ) {
          return self.emit('error', error);
        }
        main('minify-app-css');
      });
    }

    fs.readFile(path.join(source, 'main.css'),
      { encoding: 'utf-8' },
      function (error, data) {
        if ( error ) {
          return self.emit('error', error);
        }

        var min = clean.process(data);

        fs.writeFile(path.join(target, 'main.min.css'),
          min,
          { encoding: 'utf-8', flag: 'w+' },
          function (error) {
            if ( error ) {
              return self.emit('error', error);
            }

            self.emit('done');
          });
      });
  });
};