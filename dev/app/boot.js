/* */

(
  function () {
    'use strict';

    if ( typeof $$$env === 'undefined' ) {
      throw new Error('Missing environment');
    }

    if ( typeof $$$version === 'undefined' ) {
      throw new Error('Missing version');
    }

    requirejs.onError = function onRequireJsError (error) {
      console.log({type: error.requireType});

      var moduleId;

      if ( error.requireModules instanceof Array ) {
         moduleId = error.requireModules[0];
      }

      switch ( error.requireType ) {
        case 'scripterror':
          console.error('script error with module '+moduleId);
          break;
        case 'timeout':
          console.error('time out with module ' + moduleId);
          break;
        case 'require':
          console.log(error);
          console.error(error.toString());
          break;
        case 'notloaded':
          console.error(error.toString());
          break;
        case 'define':
          console.error(error.toString());
          break;
      }

      if ( $$$env === 'production' ) {
        window.location.href = '/error';
      }
    };


    var vendors = {
      angular: {
        development: 'angular-unstable/angular',
        production: 'angular-unstable/js/angular.min'
      },
      socketio: {
        development: 'socket.io-client/dist/socket.io',
        production: 'socket.io/js/socket.io.min'
      },
      less: {
        development: 'less.js/dist/less-1.5.0',
        production: 'less/js/less.min'
      },
      bootstrap: {
        development: 'bootstrap/docs/assets/js/bootstrap',
        production: 'bootstrap/js/bootstrap.min'
      },
      jquery: {
        development: 'jquery/jquery',
        production: 'jquery/js/jquery.min'
      },
      ngUIRouter: {
        development: 'angular-ui-router/release/angular-ui-router',
        production: 'angular-ui/js/angular-ui-router.min'
      }
    };

    var $vendors = [], $layers = [], $modules = [];

    var config = {
      paths: {},
      catchError: true,
      shim: {
        'angular' : {'exports' : 'angular'},
        'ngUIRouter':{
          deps: ['angular']
        },
        'bootstrap': {deps:['jquery']}
      },
    };

    var appPath = 'app';

    /*
     * DEVELOPMENT
     * ===
    */
    if ( $$$env === 'development' ) {
      /* Cache control */
      config.urlArgs = 'v=' + $$$version;
      /* Base URL */
      config.baseUrl = '/dev/';
      /* Vendors */
      $vendors = ['angular', 'socketio', 'less', 'bootstrap', 'jquery', 'ngUIRouter'];
      /* Layers */
      $layers.push(
        ['angular', 'socketio', 'less', 'jquery'],
        ['bootstrap', 'ngUIRouter']);
      /* Path to app */
      config.paths.app = 'app/app';
      /* Path to controllers */
      config.paths.controllers = 'app/controllers';
    }
    /*
     * PRODUCTION
     * ===
    */
    else if ( $$$env === 'production' ) {
      /* Base URL */
      config.baseUrl = '/app/';
      /* Vendors */
      $vendors = ['angular', 'socketio', 'bootstrap', 'jquery', 'ngUIRouter'];
      /* Layers */
      $layers.push(
        ['angular', 'socketio', 'jquery'],
        ['bootstrap', 'ngUIRouter']);
      /* Path to app */
      config.paths.app = 'app.min';
      /* Path to controllers */
      config.paths.controllers = 'controllers';
    }
    /*
     * BUILD PATHS
     * ===
    */
    $vendors.forEach(function (vendor) {
      if ( $$$env === 'development' ) {
        config.paths[vendor] = 'bower_components/' + vendors[vendor][$$$env];
      }
      if ( $$$env === 'production' ) {
        config.paths[vendor] = 'vendor/' + vendors[vendor][$$$env];
      }
    });

    requirejs.config(config);

    document.getElementById('loading-verbose').innerText =
      'Fetching dependencies';

    function onFirstLayer () {
      for ( var i = 0; i < $layers[0].length; i ++ ) {
        window[$layers[0][i]] = arguments[i];
      }

      requirejs($layers[1].concat(['app']), onSecondLayer, requirejs.onError);
    }

    function onSecondLayer () {
      if ( $$$env === 'production' ) {
        requirejs(['app'], function (app) {
          init(app);
        }, requirejs.onError);
      }

      if ( $$$env === 'development' ) {
        for ( var i = 0; i < $layers[1].length; i ++ ) {
          window[$layers[1][i]] = arguments[i];
        }
        var app = arguments[i];
        init(app);
      }
    }

    function init (app) {
      $('#loading-verbose').text('Booting app');
      window.socket = io.connect('http://localhost:3100');
      window.app = app;
      angular.bootstrap(document, [app.name]);
    }

    requirejs($layers[0], onFirstLayer, requirejs.onError);

    var loaded = {
      angular: null,
      socketio: null,
      less: null,
      jquery: null,
      bootstrap: null
    };
  }
)();