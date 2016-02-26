'use strict';

angular.module('bitaskApp.index', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
      templateUrl: './app/views/index/index.html',
      controller: 'IndexCtrl'
  });
}])

.controller('IndexCtrl', function($scope, $http) {

    $scope.send = function (){
        $http.post(bitaskAppConfig.api_url + 'index.php/event/all', [
            "hello",
            'World!!!'
        ])
    }
});