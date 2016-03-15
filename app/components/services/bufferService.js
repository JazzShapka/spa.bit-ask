'use strict';

/* Services */

/**
 * Created by WebStorm.
 * User: ANLyhin
 * Date: 03.03.2016
 * Time: 10:25
 */

angular.module('bitaskApp.service.buffer', ['ngResource', 'uuid4', 'LocalStorageModule', 'angular-cache', 'offline', 'pouchdb', 'AngularStompDK'])

.config(function (localStorageServiceProvider, offlineProvider, $provide, $httpProvider, ngstompProvider) {
  localStorageServiceProvider
    .setPrefix('bufferService')
    .setStorageType('sessionStorage')
    .setNotify(true, true);

    ngstompProvider
                .url('http://bitask-dev5.app.kras.1cbit.ru:15674/stomp')
                .credential('guest', 'guest')
                .debug(true)
                .vhost('/')
                .heartbeat(0, 0)
                .class(SockJS);

    //offlineProvider.debug(true);



        //enable cors
        //$httpProvider.defaults.useXDomain = true;

        /*$httpProvider.interceptors.push(['$location', '$injector', '$q', function ($location, $injector, $q) {
            return {
                'request': function (config) {
                    //console.log("INTERCEPTORS 1", config);
                    //add headers
                    return config;
                },

                // optional method
               'requestError': function(rejection) {
                  //console.log("INTERCEPTORS 2", rejection);
                  // do something on error
                  return $q.reject(rejection);
                },

                // optional method
                'response': function(response) {
                  //console.log("INTERCEPTORS 3", response);
                  if (response.status === 500) {
                    //console.log("INTERCEPTORS 3 status: ", response.status);
                  };
                  // do something on success
                  return response;
                },

                'responseError': function (rejection) {
                    //console.log("INTERCEPTORS 4", rejection);
                    if (rejection.status === 500) {

                        //injected manually to get around circular dependency problem.
                        var AuthService = $injector.get('Auth');

                        //if server returns 401 despite user being authenticated on app side, it means session timed out on server
                        if (AuthService.isAuthenticated()) {
                            AuthService.appLogOut();
                        }
                        $location.path('/login');
                        return $q.reject(rejection);
                    }
                }
            };
        }]);*/


})


.service('bufferService', ['$resource', '$http', '$auth', 'uuid4', 'localStorageService', 'CacheFactory', 'offline', 'connectionStatus', '$log', '$q', 'pouchDB', '$timeout', '$rootScope', 'ngstomp',
    function($resource, $http, $auth, uuid4, localStorageService, CacheFactory, offline, connectionStatus, $log, $q, pouchDB, $timeout, $rootScope, ngstomp) {

        console.log("Start bufferService.");

        var db = new pouchDB('dbname');

        $rootScope.docs = [];

        function onChange(change) {
          $rootScope.docs.push(change);
        }

        var options = {
          /*eslint-disable camelcase */
          include_docs: true,
          /*eslint-enable camelcase */
          live: true
        };

        db.changes(options).$promise
          .then(null, null, onChange);

        /*function initdb() {
            getTasks(function() {console.log("initdb ok")});
        };
        initdb();*/

        //var db = pouchDB('dbname');
        /*db.put({
          _id: 'dave@gmail.com',
          name: 'David',
          age: 69
        });*/

        //db.changes().on('change', function() {
          //console.log('Ch-Ch-Changes');
        //});

        //db.destroy();
        


        /*if (!CacheFactory.get('bookCache')) {
            // or CacheFactory('bookCache', { ... });
            CacheFactory.createCache('bookCache', {
                deleteOnExpire: 'aggressive',
                recycleFreq: 60000
            });
        }*/
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
        this.deleteTask = deleteTask;
        //this.findBookById = findBookById;
        //this.getDataById = getDataById;
        

        /* service */
        function getTasks(callback) {

            //var db = pouchDB('dbname');
            /*db.destroy().then(function (response) {
                // success
                //var db = pouchDB('dbname');
            }).catch(function (err) {
                console.log(err);
            });*/

            //var db = pouchDB('dbname');
            //var db = new pouchDB('dbname');

            /*var resetdb = function() {
              db.destroy().then(function() {
                db = new pouchDB('dbname');
              });
            };
            resetdb();*/

            db.allDocs({include_docs: true, descending: true}, function(err, doc) {
                console.log("ALL DB: ", doc.rows);
            });

            
            

            // push task to db

            //console.log(callback);
            //localStorageService.set('key124', JSON.stringify(callback));
            //console.log(JSON.stringify(callback));
            //console.log ("LSget: ", localStorageService.get('key124'));
            //console.log("Keys: ", localStorageService.keys());

            /*db.put({
                _id: uuid4.generate(),
                cmd: 'getTasks'
            });*/


            $http({
                url: 'http://api.dev2.bit-ask.com/index.php/event/all',
                method: 'POST',
                data: '[[1,false,"task/subtasks",{"parentId":"0"}]]',
                //cache: true,
                offline: true
            }).then(function successCallback(response) {
                $log.info('getTasks: ', response);


                //console.log(response.data[0][2][0]['id']);
                
                
                // LOOP: put response to db
                //console.log("length: " , response.data[0][2].length);
                for (var i = 0; i < response.data[0][2].length; i++) {
                    //delay(deleteTask(response.data[0][2][i]['id']), 2000);

                    //$timeout(deleteTask(response.data[0][2][i]['id']), 1000);

                    //deleteTask(response.data[0][2][i]['id']);
                    console.log("id: ", response.data[0][2][i]['id']);
                    console.log("taskName", response.data[0][2][i]['taskName']);

                    db.put({
                        _id: response.data[0][2][i]['id'],
                        //taskName: response.data[0][2][i]['taskName']

                        actions: response.data[0][2][i]['actions'],
                        author: response.data[0][2][i]['author'],
                        changed: response.data[0][2][i]['changed'],
                        children: response.data[0][2][i]['children'],
                        completeTime: response.data[0][2][i]['completeTime'],
                        createTime: response.data[0][2][i]['createTime'],
                        dateBeginAuthor: response.data[0][2][i]['dateBeginAuthor'],
                        dateBeginPerformer: response.data[0][2][i]['dateBeginPerformer'],
                        dateEndAuthor: response.data[0][2][i]['dateEndAuthor'],
                        dateEndPerformer: response.data[0][2][i]['dateEndPerformer'],
                        directionBranch: response.data[0][2][i]['directionBranch'],
                        id: response.data[0][2][i]['id'],
                        mapIndex: response.data[0][2][i]['mapIndex'],
                        parentId: response.data[0][2][i]['parentId'],
                        performer: response.data[0][2][i]['performer'],
                        regularSetting: response.data[0][2][i]['regularSetting'],
                        reminder: response.data[0][2][i]['reminder'],
                        role: response.data[0][2][i]['role'],
                        shared: response.data[0][2][i]['shared'],
                        status: response.data[0][2][i]['status'],
                        taskDescription: response.data[0][2][i]['taskDescription'],
                        taskName: response.data[0][2][i]['taskName'],
                        timeBeginAuthor: response.data[0][2][i]['timeBeginAuthor'],
                        timeBeginPerformer: response.data[0][2][i]['timeBeginPerformer'],
                        timeEndAuthor: response.data[0][2][i]['timeEndAuthor'],
                        timeEndPerformer: response.data[0][2][i]['timeEndPerformer'],
                        viewBranch: response.data[0][2][i]['viewBranch']

                    }).then(function (response) {
                        // handle response
                        db.allDocs({include_docs: true, descending: true}, function(err, doc) {
                            console.log("ALL DB OK: ", doc.rows);
                        });
                    }).catch(function (err) {
                        console.log(err);
                        db.allDocs({include_docs: true, descending: true}, function(err, doc) {
                            console.log("ALL DB ERR: ", doc.rows);
                        });
                    });

                };


                callback(response.data);
            }, function(rejectReason) {
                console.log('failure');
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
                $log.info('setTask: ', response);
                callback(response.data);
            });
        };

        function deleteTask(id) {
            var data = [[1, false, "task/deletetask", {"id": id}]];
            //console.log ("data: ", data);
            $http({
                url: 'http://api.dev2.bit-ask.com/index.php/event/all',
                method: 'POST',
                data: data,
                //cache: true,
                offline: true
            }).then(function (response) {
                $log.info('deleteTask: ', response);
                //callback(response.data);
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
                $log.info('getId: ', response);
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
                        else
                        {
                            $log.$warn(response.data[i][1][1]);
                        }
                    }
                }
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

        /*return {
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
        };*/

        /* STOMP SERVICE */


        console.log("Start stompService from buffer.");

    //var db = pouchDB('dbname');

    var uid = $auth.getPayload().sub;
    //console.log("uid: ", uid);

    //$scope.bufferService = bufferService;
    /*bufferService.getId(function(data) {
      //var id = data[0][2];
      console.log("id: ", data[0][2]);
      stompSubscribe(data[0][2]);
      //console.log(ide);
    });*/

    //this.stompSubscribe = stompSubscribe;

    var items = [];

    //function stompSubscribe(id) {
        ngstomp
            //.subscribeTo('/queue/queue')
                //.callback(whatToDoWhenMessageComming)
                //.withHeaders(headers)
                //.and()
            //.subscribeTo('/queue/' + id)
            .subscribeTo('/queue/' + uid)
                .callback(whatToDoWhenMessageComming)
                //.withHeaders(headers)
                //.bindTo($scope)
            .connect();
    //}

    function whatToDoWhenMessageComming(message) {
        items.push(message.body);
        //$scope.items = items;
        $rootScope.items = items;
        console.log("STOMP items: ", items);
        console.log("STOMP message: ", message);
        console.log("STOMP message.body: ", message.body);

        // parse
        var event = JSON.parse(message.body);
        //console.log("event: ", event);
        //console.log("event0: ", event[0]);
        //console.log("event1: ", event[1]);
        //console.log("event2id: ", event[2]['id']);
        //console.log("event2taskName: ", event[2]['taskName']);

        //console.log('E21: ', event[2][1]);
        var keys = Object.keys(event[2]);
        //console.log("keys: ", keys);
        //console.log("key1: ", keys[1]);
        //var key = keys[1];
        
        /*db.put({
            _id: event.id,
            title: 'Taskname'
        });*/

        // update data in db
        var db = pouchDB('dbname');
        db.get(event[2]['id']).then(function(doc) {
            return db.put({
                _id: event[2]['id'],
                _rev: doc._rev,

                        actions: doc.actions,
                        author: doc.author,
                        changed: doc.changed,
                        children: doc.children,
                        completeTime: doc.completeTime,
                        createTime: doc.createTime,
                        dateBeginAuthor: doc.dateBeginAuthor,
                        dateBeginPerformer: doc.dateBeginPerformer,
                        dateEndAuthor: doc.dateEndAuthor,
                        dateEndPerformer: doc.dateEndPerformer,
                        directionBranch: doc.directionBranch,
                        id: doc.id,
                        mapIndex: doc.mapIndex,
                        parentId: doc.parentId,
                        performer: doc.performer,
                        regularSetting: doc.regularSetting,
                        reminder: doc.reminder,
                        role: doc.role,
                        shared: doc.shared,
                        status: doc.status,
                        taskDescription: doc.taskDescription,
                        taskName: doc.taskName,
                        timeBeginAuthor: doc.timeBeginAuthor,
                        timeBeginPerformer: doc.timeBeginPerformer,
                        timeEndAuthor: doc.timeEndAuthor,
                        timeEndPerformer: doc.timeEndPerformer,
                        viewBranch: doc.viewBranch,

                //taskName: event[2]['taskName'],
                [keys[1]]: event[2][keys[1]],


            });
        }).then(function(response) {
            // handle response
            db.allDocs({include_docs: true, descending: true}, function(err, doc) {
                console.log(doc.rows);
            });

            // send message body to Service
            //taskService.showTaskEditor(message.body);
            //console.log("cmd: ", event.event + 'Service.showTaskEditor(' + message.body + ');');
            //db.destroy();
            eval(event[1] + 'Service.showTaskEditor(' + message.body + ');');

        }).catch(function (err) {
            console.log(err);
        });

        


    }











}])

.run(function ($http, $cacheFactory, CacheFactory, offline, connectionStatus, $log, $rootScope) {

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

