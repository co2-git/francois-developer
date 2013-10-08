define(function assetsCtrlAMD () {
  'use strict';
  
  return function assetsCtrl ($scope, $http, $stateParams) {
    $scope.assets = {};

    $scope.getAssets = function getAssets () {
      $http.get('/data/assets.json')
        .success(function (assets) {
          if ( typeof assets === 'object' && assets ) {
            $scope.assets = assets;
          }
        })
        .error(function (error) {
          throw error;
        });
    };

    $scope.getAssets();
  };
});