define(function projectsCtrlAMD () {
  'use strict';
  
  return ['$scope', '$http', '$stateParams',
    function projectsCtrl ($scope, $http, $stateParams) {
      $scope.projects = {};
  
      $scope.getProjects = function getprojects () {
        $http.get('/data/projects.json')
          .success(function (projects) {
            if ( typeof projects === 'object' && projects ) {
              $scope.projects = projects;
            }
          })
          .error(function (error) {
            throw error;
          });
      };
  
      $scope.getProjects();
    }];
});