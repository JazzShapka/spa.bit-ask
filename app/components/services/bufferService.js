'use strict';

/* Services */

/**
 * Created by WebStorm.
 * User: ANLyhin
 * Date: 03.03.2016
 * Time: 10:25
 */

var bufferService = angular.module('bufferService', ['ngResource', 'uuid4', 'LocalStorageModule', 'angular-cache', 'offline']);

bufferService.config(function (localStorageServiceProvider, offlineProvider, $provide, $httpProvider) {
  localStorageServiceProvider
    .setPrefix('bufferService')
    .setStorageType('sessionStorage')
    .setNotify(true, true);




/**
     * Interceptor to queue HTTP requests.
     */

    $httpProvider.interceptors.push( [ '$q', function( $q ) {

        var _queue = [];

        /**
         * Shifts and executes the top function on the queue (if any). Note this function executes asynchronously (with a timeout of 1). This
         * gives 'response' and 'responseError' chance to return their values and have them processed by their calling 'success' or 'error'
         * methods. This is important if 'success' involves updating some timestamp on some object which the next message in the queue relies
         * upon.
         */

        function _shiftAndExecuteTop() {

            setTimeout( function() {

                _queue.shift();

                if ( _queue.length > 0 ) {
                    _queue[0]();
                }
            }, 1 );
        }

        return {

            /**
             * Blocks each request on the queue. If the first request, processes immediately.
             */

            request: function( config ) {

                var deferred = $q.defer();
                _queue.push( function() {

                    deferred.resolve( config );
                } );

                if ( _queue.length === 1 ) {
                    _queue[0]();
                }

                return deferred.promise;
            },

            /**
             * After each response completes, unblocks the next request.
             */

            response: function( response ) {

                _shiftAndExecuteTop();
                return response;
            },

            /**
             * After each response errors, unblocks the next request.
             */

            responseError: function( responseError ) {

                _shiftAndExecuteTop();
                return $q.reject( responseError );
            },
        };
    } ] );








    /*$provide.decorator('connectionStatus', function ($delegate) {
        $delegate.online = true;
        $delegate.isOnline = function () {
            return $delegate.online;
        };
        return $delegate;
    });*/

    //offlineProvider.debug(true);
});

bufferService.service('bufferService', ['$resource', '$http', '$auth', 'uuid4', 'localStorageService', 'CacheFactory', 'offline', 'connectionStatus', '$log', '$q',
    function($resource, $http, $auth, uuid4, localStorageService, CacheFactory, offline, connectionStatus, $log, $q) {
        console.log("Start bufferService.");

        


        if (!CacheFactory.get('bookCache')) {
            // or CacheFactory('bookCache', { ... });
            CacheFactory.createCache('bookCache', {
                deleteOnExpire: 'aggressive',
                recycleFreq: 60000
            });
        };
        //var bookCache = CacheFactory.get('bookCache');
        //console.log("bookCache: ", bookCache);
        


        //var storageType = localStorageService.getStorageType();
        //console.log("getStorageType: ", storageType);

        //debugger;
        //console.log ("getPayload: ", $auth.getPayload().sub);
        var uid = $auth.getPayload().sub;


        this.getTasks = getTasks;
        this.setTask = setTask;
        this.getId = getId;
        //this.findBookById = findBookById;
        //this.getDataById = getDataById;
        

        /* service */
        function getTasks(callback) {
            $http({
                url: 'http://api.dev2.bit-ask.com/index.php/event/all',
                method: 'POST',
                data: '[[1, false, "task/subtasks", {"parentId": 0}]]',
                //cache: true,
                offline: true
            }).then(function successCallback(response) {
                $log.info('POST RESULT', response);
                callback(response.data);
            });
        };

        function setTask(callback, taskName) {
            var uuid = uuid4.generate();
            var data = [[1, false, "task/addtask", {"id": uuid, "authorId": uid, "taskName": taskName}]];
            //console.log ("data: ", data);
            $http({
                url: 'http://api.dev2.bit-ask.com/index.php/event/all',
                method: 'POST',
                data: data,
                //cache: true,
                offline: true
            }).then(function (response) {
                $log.info('POST RESULT', response);
                callback(response.data);
            });
        };

        function getId(callback) {
            $http({
                url: 'http://api.dev2.bit-ask.com/index.php/event/all',
                method: 'POST',
                data: '[[1, false, "user/getid"]]',
                //cache: true,
                offline: true
            }).then(function (response) {
                $log.info('POST RESULT', response);
                callback(response.data);
            });
            
        };



        /*function findBookById(id) {
            return $http.post('http://api.dev2.bit-ask.com/index.php/event/all', '[[1, false, "task/subtasks", {"parentId": 0}]]', {offline: true});
        };*/

        
        /*function getDataById(id) {
              var deferred = $q.defer();
              var start = new Date().getTime();

              $http.get('api/data/' + id, {
                cache: true
              }).success(function (data) {
                console.log('time taken for request: ' + (new Date().getTime() - start) + 'ms');
                deferred.resolve(data);
              });
              return deferred.promise;
        };*/
        


        


        /* factory */
        /*return {
            getTasks : function() {
                return $http({
                    url: 'http://api.dev2.bit-ask.com/index.php/event/all',
                    method: 'POST',
                    data: '[[1, false, "task/subtasks", {"parentId": 0}]]'
                })
            },
            setTask : function(taskName) {
                var uuid = uuid4.generate();
                var data = [[1, false, "task/addtask", {"id": uuid, "authorId": uid, "taskName": taskName}]];
                //console.log ("data: ", data);
                return $http({
                    url: 'http://api.dev2.bit-ask.com/index.php/event/all',
                    method: 'POST',
                    data: data
                })
            }
        };*/

        return {
            getDataById: function (id) {
              var deferred = $q.defer();
              var start = new Date().getTime();

              $http.get('http://api.dev2.bit-ask.com/index.php/event/all', {
                cache: true,
                offline: true,
                data: '[[1, false, "task/subtasks", {"parentId": 0}]]'
              }).success(function (data) {
                console.log('time taken for request: ' + (new Date().getTime() - start) + 'ms');
                deferred.resolve(data);
              });
              return deferred.promise;
            }
        };


}]);

bufferService.run(function ($http, $cacheFactory, CacheFactory, offline, connectionStatus, $log, $rootScope) {

    $http.defaults.cache = CacheFactory('defaultCache', {
            maxAge: 15 * 60 * 1000, // Items added to this cache expire after 15 minutes
            cacheFlushInterval: 60 * 60 * 1000, // This cache will clear itself every hour
            deleteOnExpire: 'aggressive' // Items will be deleted from this cache when they expire
    });


  $http.defaults.cache = $cacheFactory('custom2');
  offline.stackCache = CacheFactory.createCache('my-cache2', {
    storageMode: 'localStorage'
  });

  offline.start($http);


  connectionStatus.$on('online', function () {
    $log.info('bufferService: We are now online');
  });

  connectionStatus.$on('offline', function () {
    $log.info('bufferService: We are now offline');
  });

  $rootScope.test = 'It works! Using ' + (CacheFactory ? 'angular-cache' : 'undefined');


});

