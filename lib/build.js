module.exports = function build () {
  var main  = require('../main'),
    path    = require('path'),
    fs      = require('fs'),
    async   = require('async'),
    moment  = require('moment'),
    self    = this,
    /* This array is made of groups. Groups get called in series
     - when items in a group get called in parallels (see module async) */
    libs    = [
                [
                  'build-dir'
                ],
                
                [
                  'install-bower-components',
                  'optimize-app',
                  'minify-app-js',
                  'compile-app-less'
                ],

                [
                  'copy-vendor-js-min',
                  'compile-vendor-less',
                  'copy-vendor-images',
                  'build-vendor-extra',
                  'minify-vendor-js'
                ]
              ],
    /* This is used to store the series:
      flow = { group1: Function, group2: Function };
      async.series(flow, Function); */
    flow    = {};

  /* For each group */
  libs.forEach(function (group, i) {
    /* Creating the group serie */
    flow['group' + (i+1)] = function (serieCallback) {
      /* The parallels (the group items) */
      var parallels = {};
      /* For each group */
      group.forEach(function (lib) {
        /* Creating the parallels for each lib script */
        parallels[lib] = function (parallelCallback) {
          /* CLI fb */
          self.emit('message.cli', lib);
          /* Importing library */
          main(lib)
            /* If importing library failed */
            .on('error', function (error) {
              self.emit('message.cli', lib.red);
              parallelCallback(error);
            })
            /* If importing library ok */
            .on('done', function () {
              self.emit('message.cli', lib.green);
              parallelCallback(null, true);
            });
        };
      });
      /* Parallels (group items) callback */
      async.parallel(parallels, function (error, results) {
        if ( error ) {
          return self.emit('error', error);
        }
        else {
          serieCallback();
        }
      });
    };
  });
  /* Series (groups) callback */
  async.series(flow, function (error, results) {
    if ( error ) {
      return self.emit('error');
    }
    /* Write results  to the log */
    fs.writeFile(path.join(path.dirname(__dirname), 'build/build.log'),
      moment().format('MMMM Do YYYY, h:mm:ss a'),
      function (error) {
        if ( error ) {
          self.emit('error', error);
        }
      });
    console.log('Built'.bold.green);
  });
};