'use strict';

/* App Module */

var buffer = angular.module('buffer', [
  'ngRoute', 'pouchdb'
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

buffer.controller('BufferCtrl', ['$scope', 'bufferService', 'offline', 'connectionStatus', '$http', '$log', 'CacheFactory', '$rootScope', 'pouchDB',
  function($scope, bufferService, offline, connectionStatus, $http, $log, CacheFactory, $rootScope, pouchDB) {

    //var db = pouchDB('dbname');

    //var storageType = localStorageService.getStorageType();
    //console.log("getStorageType: ", storageType);
    
    //$scope.bufferService = bufferService;
    //$scope.stompService = stompService;

    /* factory */
    /*bufferService.getTasks().success(function(data) {
      $scope.tasks = data;
      console.log(data);
    });*/

    /*bufferService.setTask(function(data) {
      console.log("setTask: ", data);
    }, 'New task 123');*/

    bufferService.getTasks(function(data) {
      //$scope.tasks = data;
      //console.log("getTasks in buffer.js: ", data);
    });

    /*bufferService.getId(function(data) {
      $scope.id = data;
      //console.log("getId: ", data[0][2]);
      //stompService.stompSubscribe(data[0][2]);
    });*/

    //console.log ("findBookById1: ", bufferService.findBookById(123));

    /*bufferService.findBookById(123).then(function (response) {
      $log.info('POST RESULT', response);
      //console.log("findBookById2: ", response.data);
    });*/



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
      $http.post('http://api.dev2.bit-ask.com/index.php/event/all', '[[1, false, "task/subtasks", {"parentId": 0}]]', {offline: true})
      .then(function (response) {
        $log.info('POST RESULT', response);
        $scope.tasks = response.data;
        //console.log("scope.makePOST: ", $scope.makePOST);
      }, function (error) {
        $log.info('POST ERROR', error);
        $scope.tasks = response.data;
      });
    };

    /*bufferService.getDataById(8)
    .then(function (response) {
      //$log.info('POST RESULT: ', response);
      //console.log("findBookById2: ", response.data);
    });*/





    //if (connectionStatus.isOnline())
    //$log.info('We have internet!');



  }]);


buffer.run(function ($http, $cacheFactory, CacheFactory, offline, connectionStatus, $log) {
  $http.defaults.cache = $cacheFactory('custom');
  offline.stackCache = CacheFactory.createCache('my-cache', {
    storageMode: 'localStorage'
  });

  offline.start($http);

  connectionStatus.$on('online', function () {
    $log.info('buffer: We are now online');
    //$scope.tasks = data;
  });

  connectionStatus.$on('offline', function () {
    $log.info('buffer: We are now offline');
  });


});
