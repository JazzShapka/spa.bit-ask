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

buffer.controller('BufferCtrl', ['$scope', 'bufferService', 'stompService', 'offline', 'connectionStatus', '$http', '$log', 'CacheFactory',
  function($scope, bufferService, stompService, offline, connectionStatus, $http, $log, CacheFactory) {

    //var storageType = localStorageService.getStorageType();
    //console.log("getStorageType: ", storageType);
    
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

    console.log ("findBookById1: ", bufferService.findBookById(123));

    bufferService.findBookById(123).then(function (response) {
      console.log("findBookById2: ", response.data);
    });



    //offline.stackCache = $cacheFactory('custom-cache');
    $scope.toggleOnline = function () {
      connectionStatus.online = !connectionStatus.online;
      offline.processStack();
    };

    $scope.isOnline = function () {
      return connectionStatus.isOnline();
    };

    $scope.makeGET = function () {
      $http.get('/test.json', {offline: true})
      .then(function (response) {
        $log.info('GET RESULT', response.data);
      }, function (error) {
        $log.info('GET ERROR', error);
      });
    };

    $scope.makePOST = function () {
      $http.post('/test.json', {}, {offline: true})
      .then(function (response) {
        $log.info('POST RESULT', response);
      }, function (error) {
        $log.info('POST ERROR', error);
      });
    };





    if (connectionStatus.isOnline())
    $log.info('We have internet!');



  }]);


buffer.run(function ($http, $cacheFactory, CacheFactory, offline) {
  $http.defaults.cache = $cacheFactory('custom');
  offline.stackCache = CacheFactory.createCache('my-cache', {
    storageMode: 'localStorage'
  });

  offline.start($http);
});
