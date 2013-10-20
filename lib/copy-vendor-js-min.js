module.exports = function copyVendorJSMin (then) {
  var path    = require('path'),
    fs        = require('fs'),
    json      = require('../build.json'),
    main      = require('../main'),
    base      = path.dirname(__dirname),
    target    = 'build/app/vendor',
    bowerComp = 'dev/bower_components',
    copies    = [],
    self      = this,
    from,
    to,
    cursorVendorJs    = 0;

  for ( var vendor in json.vendors ) {
    if ( json.vendors[vendor].copyminjs ) {
      if ( ! json.vendors[vendor].$path ) {
        json.vendors[vendor].$path = vendor;
      }

      from = path.join(base, bowerComp, json.vendors[vendor].$path);
      to = path.join(base, target, vendor, 'js');

      if ( json.vendors[vendor].copyminjs === true ) {
        from = path.join(from, vendor + '.min.js');
        to = path.join(to, vendor + '.min.js');
      }

      else if ( typeof json.vendors[vendor].copyminjs === 'object' ) {
        if ( json.vendors[vendor].copyminjs.$path ) {
          from = path.join(from, json.vendors[vendor].copyminjs.$path);
        }
        for ( var minjs in json.vendors[vendor].copyminjs ) {
          if ( ! minjs.match(/^\$/) ) {
            if ( json.vendors[vendor].copyminjs[minjs] === true ) {
              from = path.join(from, minjs + '.min.js');
              to = path.join(to, minjs + '.min.js');
            }

            else if ( typeof json.vendors[vendor].copyminjs[minjs] === 'object' ) {
              if ( json.vendors[vendor].copyminjs[minjs].name ) {
                from = path.join(from, json.vendors[vendor].copyminjs[minjs].name + '.min.js');
              }
              else {
                from = path.join(from, minjs + '.min.js');
              }

              to = path.join(to, minjs + '.min.js');

              if ( json.vendors[vendor].copyminjs[minjs].map ) {
                  copies.push({ from: from.replace(/\.js$/, '.map'), to: to.replace(/\.js$/, '.map'),
                    vendor: vendor });
                }
            }
          }
        }
      }

      copies.push({ from: from, to: to, vendor: vendor });
    }
  }

  copies.forEach(function (copy) {
    var vendorDir = path.join(base, target, copy.vendor);

    main('copy', copy.from, copy.to)
      
      .on('error', function (error) {
        self.emit(error);
      })
      
      .on('message', function (message) {
        self.emit('message', message);
      })
      
      .on('done', function () {
        cursorVendorJs ++;
        if ( cursorVendorJs === copies.length ) {
          self.emit('done');
        }
      });
  });
};