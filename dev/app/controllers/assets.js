define(function assetsCtrlAMD () {
  'use strict';

  var asset;
  
  return ['$scope', '$http', '$stateParams',
    function assetsCtrl ($scope, $http, $stateParams) {
      $scope.assets = [];
  
      $scope.getAssets = function getAssets () {
        $http.get('/data/assets.json')
          .success(function (assets) {
            if ( typeof assets === 'object' && assets ) {
              for ( var name in assets ) {
                asset = assets[name];
                asset.name = name;
                $scope.assets.push(asset);
              }
            }
          })
          .error(function (error) {
            throw error;
          });
      };
  
      $scope.getAssets();
    }];
});