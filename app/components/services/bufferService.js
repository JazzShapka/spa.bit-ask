'use strict';

/* Services */

/**
 * Created by WebStorm.
 * User: ANLyhin
 * Date: 03.03.2016
 * Time: 10:25
 */

var bufferService = angular.module('bufferService', ['ngResource', 'uuid4', 'LocalStorageModule', 'angular-cache', 'offline']);

bufferService.config(function (localStorageServiceProvider, offlineProvider, $provide) {
  localStorageServiceProvider
    .setPrefix('bufferService')
    .setStorageType('sessionStorage')
    .setNotify(true, true);

    /*$provide.decorator('connectionStatus', function ($delegate) {
        $delegate.online = true;
        $delegate.isOnline = function () {
            return $delegate.online;
        };
        return $delegate;
    });*/

    //offlineProvider.debug(true);
});

bufferService.service('bufferService', ['$resource', '$http', '$auth', 'uuid4', 'localStorageService', 'CacheFactory', 'offline', 'connectionStatus', '$log',
    function($resource, $http, $auth, uuid4, localStorageService, CacheFactory, offline, connectionStatus, $log) {
        console.log("Start bufferService.");

        $http.defaults.cache = CacheFactory('defaultCache', {
            maxAge: 15 * 60 * 1000, // Items added to this cache expire after 15 minutes
            cacheFlushInterval: 60 * 60 * 1000, // This cache will clear itself every hour
            deleteOnExpire: 'aggressive' // Items will be deleted from this cache when they expire
        });


        if (!CacheFactory.get('bookCache')) {
            // or CacheFactory('bookCache', { ... });
            CacheFactory.createCache('bookCache', {
                deleteOnExpire: 'aggressive',
                recycleFreq: 60000
            });
        }
        //var bookCache = CacheFactory.get('bookCache');
        //console.log("bookCache: ", bookCache);
        


        //var storageType = localStorageService.getStorageType();
        //console.log("getStorageType: ", storageType);

        //debugger;
        //console.log ($auth.getToken());
        //console.log ("getPayload: ", $auth.getPayload().sub);

        var self = this;

        //var uid = $auth.getPayload().sub;



        this.getTasks = getTasks;
        this.setTask = setTask;
        this.getId = getId;
        this.findBookById = findBookById;
        

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

        /**
         * Отправить запрос на сервер, ответ обрабатывает callback
         * @param data - данные в формате [id, false, "task/openedtasks", {parentId:0}]
         * @param callback
         */
        self.send = function (data, callback){
            $http({
                url: 'http://api.dev2.bit-ask.com/index.php/event/all',
                method: 'POST',
                data: data
            }).then(function successCallback(response) {
                if(typeof callback == 'function')
                {
                    for (var i=0; i<response.data.length; i++)
                    {
                        if(response.data[i][1][0] == 200)
                        {
                            callback(response.data[i][2]);
                        }
                    }
                }
            });
        };

        function findBookById(id) {
            return $http.post('http://api.dev2.bit-ask.com/index.php/event/all', '[[1, false, "task/subtasks", {"parentId": 0}]]');
        };
        


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


}]);

bufferService.run(function ($http, $cacheFactory, CacheFactory, offline, connectionStatus, $log) {
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


});

