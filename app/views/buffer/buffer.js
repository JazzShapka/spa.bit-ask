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
        controller: 'myController2'
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

    /* factory */
    /*bufferService.getTasks().success(function(data) {
      $scope.tasks = data;
      console.log(data);
    });*/

    bufferService.setTask(function(data) {
      console.log("SETTASK: ");
    }, 'Zadacha');

    bufferService.getTasks(function(data) {
      $scope.tasks = data;
      console.log("data456: ", data);
    });

    bufferService.getId(function(data) {
      //$scope.tasks = data;
      console.log("id: ", data);
    });


  }]);
