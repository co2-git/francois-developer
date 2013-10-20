define(function assetCtrlAMD () {
  'use strict';
  
  return ['$scope', '$http', '$stateParams',
    function assetCtrl ($scope, $http, $stateParams) {
      $scope.asset = {};
      $scope.identity = angular.identity;
  
      $scope.getAsset = function getasset () {
        $http.get('/data/assets.json')
          .success(function (assets) {
            if ( typeof assets === 'object' && assets &&
              typeof assets[$stateParams.asset] === 'object' ) {
              $scope.asset = assets[$stateParams.asset];
              $scope.asset.name = $stateParams.asset;
              $scope.asset.projects = [];
  
              $http.get('/data/projects.json')
                .success(function (projects) {
                  for ( var project in projects ) {
                    if ( projects[project].assets.indexOf($scope.asset.name) > -1 ) {
                      $scope.asset.projects.push(project);
                    }
                  }
                });
            }
          })
          .error(function (error) {
            throw error;
          });
      };
  
      $scope.getAsset();
    }];
});