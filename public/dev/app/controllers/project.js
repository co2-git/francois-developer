define(function projectCtrlAMD () {
  'use strict';
  
  return function projectCtrl ($scope, $http, $stateParams) {
    $scope.project = {};
    $scope.identity = angular.identity;

    $scope.getProject = function getproject () {
      $http.get('/data/projects.json')
        .success(function (projects) {
          if ( typeof projects === 'object' && projects &&
            typeof projects[$stateParams.project] === 'object' ) {
            $scope.project = projects[$stateParams.project];
            $scope.project.name = $stateParams.project;
          }
        })
        .error(function (error) {
          throw error;
        });
    };

    $scope.getProject();
  };
});