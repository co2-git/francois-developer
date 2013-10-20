module.exports = function compileVendorLess () {
  var buildJson = require('../build.json'),
    main = require('../main'),
    path = require('path'),
    fs = require('fs'),
    base = path.dirname(__dirname),
    lessify = [],
    self = this,
    from,
    to,
    cursor = 0;

  for ( var vendor in buildJson.vendors ) {
    from = path.join(base, buildJson.paths.bower_components);
    to = path.join(base, buildJson.paths.app, buildJson.paths.vendors, vendor, 'css');
    
    if ( buildJson.vendors[vendor].$path ) {
      from = path.join(from, buildJson.vendors[vendor].$path);
    } else {
      from = path.join(from, vendor);
    }

    if ( typeof buildJson.vendors[vendor].less === 'object' ) {
      if ( buildJson.vendors[vendor].less.$path ) {
        from = path.join(buildJson.vendors[vendor].less.$path);
      } else {
        from = path.join(from, 'less');
      }
      
      for ( var less in buildJson.vendors[vendor].less ) {
        if ( less != '$path' ) {
          if ( buildJson.vendors[vendor].less[less] === true ) {
            lessify.push({
              vendor: vendor,
              from: path.join(from, less + '.less'),
              to: path.join(to, less + '.min.css')
            });
          }

          else if ( typeof buildJson.vendors[vendor].less[less] === 'string' ) {
            lessify.push({
              vendor: vendor,
              from: path.join(from, buildJson.vendors[vendor].less[less] + '.less'),
              to: path.join(to, less + '.min.css')
            });
          }
        }
      }
    }
  }

  lessify.forEach(function (less) {
    main('lessc', less.from, less.to, { rootPath: '/app/vendor/' + less.vendor + '/img/' })
      .on('message', function (message) {
        self.emit('message', message);
      })
      .on('error', function (error) {
        self.emit('error', error);
      })
      .on('done', function () {
        cursor ++;

        if ( cursor === lessify.length ) {
          self.emit('done');
        }
      });
  });
};