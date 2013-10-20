module.exports = function copyVendorImages () {
  var buildJson = require('../build.json'),
    path = require('path'),
    fs = require('fs'),
    main = require('../main'),
    base = path.dirname(__dirname),
    self = this,
    from,
    to,
    copies = [],
    cursor = 0;

  for ( var vendor in buildJson.vendors ) {
    if ( typeof buildJson.vendors[vendor].images === 'object' ) {
      from = path.join(base, buildJson.paths.bower_components);
      to = path.join(base, buildJson.paths.app, buildJson.paths.vendors, vendor, 'img');

      if ( buildJson.vendors[vendor].$path ) {
        from = path.join(from, buildJson.vendors[vendor].$path);
      } else {
        from = path.join(from, vendor);
      }

      if ( buildJson.vendors[vendor].images.$path ) {
        from = path.join(from, buildJson.vendors[vendor].images.$path);
      } else {
        from = path.join(from, 'img');
      }

      for ( var image in buildJson.vendors[vendor].images ) {
        if ( ! image.match(/^\$/) ) {
          if ( buildJson.vendors[vendor].images[image] === true ) {
            from = path.join(from, image);
            to = path.join(to, image);
          }
        }

        copies.push({ from: from, to: to, vendor: vendor });

        from = path.dirname(from);
        to = path.dirname(to);
      }
    }
  }

  copies.forEach(function (copy) {
    main('copy', copy.from, copy.to)
      .on('error', function (error) {
        self.emit('error', error);
      })
      .on('message', function (message) {
        self.emit('message', message);
      })
      .on('done', function () {
        cursor ++;

        if ( cursor === copies.length ) {
          self.emit('done');
        }
      });
  });
};