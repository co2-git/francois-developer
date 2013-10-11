define(['angular', 'controllers/assets', 'controllers/projects', 'controllers/project',
  'controllers/asset', 'controllers/hire-me'],

  function (angular, assetsCtrl, projectsCtrl, projectCtrl, assetCtrl, hireMeCtrl) {
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
            })

            .state('asset', {
              url: '/assets/:asset',
              views: {
                page: {
                  templateUrl: '/partials/asset',
                  controller: assetCtrl
                }
              }
            })

            .state('projects', {
              url: '/projects',
              views: {
                page: {
                  templateUrl: '/partials/projects',
                  controller: projectsCtrl
                }
              }
            })

            .state('project', {
              url: '/projects/:project',
              views: {
                page: {
                  templateUrl: '/partials/project',
                  controller: projectCtrl
                }
              }
            })

            .state('hire-me', {
              url: '/hire-me',
              views: {
                page: {
                  templateUrl: '/partials/hire-me',
                  controller: hireMeCtrl
                }
              }
            });
        }])
      .controller(
        function ($scope, $rootScope) {
          $scope.goTo = function (to) {
            console.log('cooool');
            location.hash = '/' + to;
          };
        }
      )
      // Init
      .run([        '$rootScope', '$state', '$stateParams', '$http',
          function ($rootScope,   $state,   $stateParams, $http) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.goTo = function (to) {
              location.hash = '/' + to;
            };
          }
        ]
      );
});