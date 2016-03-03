'use strict';

/* App Module */

var buffer = angular.module('buffer', [
  'ngRoute'
]);

buffer.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/buffer', {
        templateUrl: 'app/views/buffer/buffer.html',
        controller: 'BufferCtrl'
      }).
      when('/buffer/:bufferId', {
        templateUrl: 'app/views/buffer/buffer-detail.html',
        controller: 'bufferDetailCtrl'
      }).
      otherwise({
        redirectTo: '/buffer'
      });
  }]);

buffer.controller('BufferCtrl', ['$scope', 'bufferService',
  function($scope, bufferService) {
    //$scope.phones = Phone.query();
    //$scope.orderProp = 'age';
    $scope.bufferService = bufferService;
    //$scope.tasks = bufferService.getTasks();
    //bufferService.getCard();
    
    //console.log("getTasks: ", bufferService.getTasks());
    //$scope.tasks = bufferService.getTasks();

    bufferService.getTasks().success(function(data) {
      $scope.tasks = data;
      console.log(data);
    });


  }]);