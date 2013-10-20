 module.exports = function minifyVendorJS () {
  var path    = require('path'),
    fs        = require('fs'),
    json      = require('../build.json'),
    main      = require('../main'),
    base      = path.dirname(__dirname),
    target    = 'build/app/vendor',
    bowerComp = 'dev/bower_components',
    jsFiles   = [],
    self      = this,
    from,
    to,
    cursor    = 0;

  for ( var vendor in json.vendors ) {
    if ( json.vendors[vendor].minjs ) {
      if ( ! json.vendors[vendor].$path ) {
        json.vendors[vendor].$path = vendor;
      }

      from = path.join(base, bowerComp, json.vendors[vendor].$path);
      to = path.join(base, target, vendor, 'js');

      if ( json.vendors[vendor].minjs === true ) {
        from = path.join(from, vendor + '.js');
        to = path.join(to, vendor + '.min.js');
      }

      else if ( typeof json.vendors[vendor].minjs === 'object' ) {
        if ( json.vendors[vendor].minjs.$path ) {
          from = path.join(from, json.vendors[vendor].minjs.$path);
        }
        for ( var minjs in json.vendors[vendor].minjs ) {
          if ( ! minjs.match(/^\$/) ) {
            if ( json.vendors[vendor].minjs[minjs] === true ) {
              from = path.join(from, minjs + '.js');
              to = path.join(to, minjs + '.min.js');
            }
          }
        }
      }

      else if ( typeof json.vendors[vendor].minjs === 'string' ) {
        from = path.join(from, json.vendors[vendor].minjs + '.js');
        to = path.join(to, vendor + '.min.js');
      }

      jsFiles.push({ input: [from], out: to, vendor: vendor });
    }
  }

  jsFiles.forEach(function (file) {
    console.log(file);
    file.sourceMap = path.join(
      json.paths.ast, path.basename(file.out) + '.map');

    main('uglify',  file)
      .on('error', function (error) {
        self.emit('error', error);
      })
      .on('done', function () {
        cursor ++;
        if ( cursor === jsFiles.length ) {
          self.emit('done');
        }
      });
  });
 };