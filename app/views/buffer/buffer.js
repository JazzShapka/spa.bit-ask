'use strict';

/* App Module */

var buffer = angular.module('buffer', [
  'ngRoute', 'LocalStorageModule'
]);

buffer.config(['$routeProvider', 'localStorageServiceProvider',
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

buffer.controller('BufferCtrl', ['$scope', 'bufferService', 'stompService', 'localStorageService',
  function($scope, bufferService, stompService, localStorageService) {

    var storageType = localStorageService.getStorageType();
    console.log("getStorageType: ", storageType);
    
    //$scope.bufferService = bufferService;
    //$scope.stompService = stompService;

    /* factory */
    /*bufferService.getTasks().success(function(data) {
      $scope.tasks = data;
      console.log(data);
    });*/

    bufferService.setTask(function(data) {
      console.log("setTask: ", data);
    }, 'New task 123');

    bufferService.getTasks(function(data) {
      $scope.tasks = data;
      console.log("getTasks: ", data);
    });

    bufferService.getId(function(data) {
      $scope.id = data;
      console.log("getId: ", data[0][2]);
      stompService.stompSubscribe(data[0][2]);
    });


  }]);
