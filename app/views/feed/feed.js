'use strict';

angular.module('bitaskApp.index', ['ngRoute', 'bitaskApp.service.keyboard'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
      templateUrl: './app/views/feed/feed.html',
      controller: 'IndexCtrl'
  });
}])

.controller('IndexCtrl', function($scope, $http, keyboardService) {

    $scope.send = function (){
        $http.post(bitaskAppConfig.api_url + 'index.php/event/all', [
            "hello",
            'World!!!'
        ])
    };

    keyboardService.on(function (){
        console.log('index - keypress');
    });
});