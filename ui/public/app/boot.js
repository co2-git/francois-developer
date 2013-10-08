require.config({
  paths: {
    jquery:           '../bower_components/jquery/jquery.min',
    bootstrap:        '../bower_components/bootstrap/docs/assets/js/bootstrap',
    angular:          '../bower_components/angular/angular.min',
    angularUIRouter:  '../bower_components/angular-ui-router/release/angular-ui-router',
    angularResource:  '../bower_components/angular-resource/angular-resource.min'
  },
  shim: {
    'angular' : {'exports' : 'angular'},
    'angular-resource' : {deps:['angular']},
    'bootstrap': {deps:['jquery']}
  },
  priority: [
    "angular"
  ],
  urlArgs: 'v=1.1'
});

require( [
    'bootstrap',
    'angular',
    'app'
  ], function (bootstrap, angular, app) {
    'use strict';
    requirejs(['angularUIRouter'], function (ngUIRouter) {
      window.app = app;
      angular.bootstrap(document, [app.name]);
    });
});