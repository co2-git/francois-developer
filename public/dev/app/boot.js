/* */

if ( typeof $$$env === 'undefined' ) {
  throw new Error('Missing environment');
}

if ( typeof $$$version === 'undefined' ) {
  throw new Error('Missing version');
}

var config = {
  shim: {
    'angular' : {'exports' : 'angular'},
    'bootstrap': {deps:['jquery']}
  },
  priority: [
    "angular"
  ]
};

if ( $$$env === 'development' ) {
  config.urlArgs = 'v=' + $$$version;
  config.paths = {
    jquery:           '../bower_components/jquery/jquery',
    bootstrap:        '../bower_components/bootstrap/docs/assets/js/bootstrap',
    angular:          '../bower_components/angular/angular',
    angularUIRouter:  '../bower_components/angular-ui-router/release/angular-ui-router',
    socketIOClient:   '../bower_components/socket.io-client/dist/socket.io'
  };
}
else if ( $$$env === 'production' ) {
  config.paths = {
    jquery:           './vendors/jquery.min',
    bootstrap:        './vendors/bootstrap.min',
    angular:          './vendors/angular.min',
    angularUIRouter:  './vendors/angular-ui-router.min',
    socketIOClient:   './vendors/socket.io.min'
  };
}
else {
  throw new Error('Unknown environment: ' + $$$env);
}

requirejs.config(config);

requirejs( ['bootstrap',  'angular',  'socketIOClient'],
  function (bootstrap,    angular,    socketIO) {
    'use strict';
    
    window.socket = io.connect('http://localhost:3100');

    requirejs([ 'angularUIRouter',  'app'],
      function (ngUIRouter,         app) {
        window.app = app;
        angular.bootstrap(document, [app.name]);
      });
});