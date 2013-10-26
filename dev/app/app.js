define(['angular', 'angularUIRouter', 'controllers/assets', 'controllers/projects', 'controllers/project',
  'controllers/asset'],

  function (angular, ngRouter, assetsCtrl, projectsCtrl) {
    'use strict';

    return angular.module('francois-developer-ng', ['ui.router'])
      .config(['$stateProvider',  '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
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
                // page: {
                //   templateUrl: '/partials/asset',
                //   controller: assetCtrl
                // }
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
                // page: {
                //   templateUrl: '/partials/project',
                //   controller: projectCtrl
                // }
              }
            })
            .state('build', {
              url: '/build',
              views: {
                // page: {
                //   templateUrl: '/partials/build',
                //   controller: projectCtrl
                // }
              }
            });
        }])
      // Init
      .run([        '$rootScope', '$state', '$stateParams', '$http',
          function ($rootScope,   $state,   $stateParams, $http) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

            $rootScope.goTo = function (to) {
              location.hash = '/' + to;
            };

            $rootScope.version = $('link[rel=version]').attr('content');

            socket.emit('client ready');

            socket.on('version', function (version) {
              console.log('Got new version', version);
              $rootScope.version = version;
              $rootScope.$apply();
            });
          }
        ]
      );
});