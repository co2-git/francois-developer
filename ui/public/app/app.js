define(['angular', 'controllers/assets'],

  function (angular, assetsCtrl) {
    'use strict';

    return angular.module('datahop', ['ui.compat'])
      .config(['$stateProvider',  '$routeProvider', '$urlRouterProvider',
        function ($stateProvider, $routeProvider,   $urlRouterProvider) {
          $stateProvider

            .state('home', {
              url: '',
              views: {
                page: {
                  templateUrl: '/partials/home'
                }
              }
            })

            .state('assets', {
              url: '/assets',
              views: {
                page: {
                  templateUrl: '/partials/assets',
                  controller: assetsCtrl
                }
              }
            });
        }])
      .controller(
        function ($scope, $rootScope) {
        }
      )
      // Init
      .run([        '$rootScope', '$state', '$stateParams', '$http',
          function ($rootScope,   $state,   $stateParams, $http) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
          }
        ]
      );
});