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

buffer.controller('BufferCtrl', ['$scope', 'bufferService', 'stompService',
  function($scope, bufferService, stompService) {
    //$scope.phones = Phone.query();
    //$scope.orderProp = 'age';
    $scope.bufferService = bufferService;
    $scope.stompService = stompService;
    //stompService.stompSubscribe();
    
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
      console.log("setTask: ", data);
    }, 'New task');

    bufferService.getTasks(function(data) {
      $scope.tasks = data;
      console.log("getTasks: ", data);
    });

    bufferService.getId(function(data) {
      $scope.id = data;
      console.log("getId: ", data);
    });


  }]);
