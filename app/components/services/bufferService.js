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


.service('bufferService', ['$resource', '$http', '$auth', 'uuid4', 'localStorageService', 'CacheFactory', 'offline', 'connectionStatus', '$log', '$q', 'pouchDB', '$timeout', '$rootScope', 'ngstomp', 'dbService',
    function($resource, $http, $auth, uuid4, localStorageService, CacheFactory, offline, connectionStatus, $log, $q, pouchDB, $timeout, $rootScope, ngstomp, dbService) {

        //console.log = function() {};
        console.log("Start bufferService.");

        //var db = pouchDB('dbname');
        var db = dbService.getDb();
        db.destroy().then(function (response) {
            // success
        }).catch(function (err) {
            console.log(err);
        });

        $rootScope.docs = [];
        $rootScope.queues = [];

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

        var uid = $auth.getPayload().sub;



        this.getTasks = getTasks;
        this.setTask = setTask;
        this.getId = getId;
        this.deleteTask = deleteTask;
        this.sendData = sendData;
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





        var dbqueue = pouchDB('queue');
        /*dbqueue.destroy().then(function (response) {
            // success
        }).catch(function (err) {
            console.log(err);
        });*/

        // list all docs in db | список всех документов в бд
        dbqueue.allDocs({
            include_docs: true,
            attachments: true,
            //deleted:true,
            //key: ['deleted:true'],
        }).then(function (result) {
            // handle result
            console.log("START dbqueue.allDocs result: ", result);
        }).catch(function (err) {
            console.log(err);
        });

            dbqueue.createIndex({
                index: {
                    fields: ['deleted']
                }
            }).then(function (result) {
                // yo, a result
                console.log("dbqueue.createIndex result: ", result);
            }).catch(function (err) {
                // ouch, an error
                console.log("dbqueue.createIndex err: ", err);
            });

            dbqueue.find({
                selector: {deleted: false},
                fields: ['_id', 'data']
            }).then(function (result) {
                // yo, a result
                console.log("dbqueue.find result: ", result);
            }).catch(function (err) {
                // ouch, an error
                console.log("dbqueue.find err: ", err);
            });


        // create task | создание задачи
        function setTask(taskName) {
            console.log("setTask");
            //var uuid = uuid4.generate();
            var uuid = 'ba1eb446-0bb3-ab0a-3e44-a182fc48d716';
            var data = [[1, false, "task/addtask", {"id": uuid, "taskName": taskName}]];

            if (online === false) {
                // put data to db queue | пишем в бд запрос
                dbqueue.put({
                    _id: uuid,
                    data: data,
                    deleted: false
                }).then(function (response) {
                    // handle response

                    // list all docs in db
                    dbqueue.allDocs({
                        include_docs: true,
                        attachments: true
                    }).then(function (result) {
                        // handle result
                        console.log("setTask dbqueue.allDocs result: ", result);
                    }).catch(function (err) {
                        console.log(err);
                    });

                }).catch(function (err) {
                    console.log(err);
                });
            
            } else {

                //console.log ("data: ", data);
                $http({
                    url: 'http://api.dev2.bit-ask.com/index.php/event/all',
                    method: 'POST',
                    data: data,
                    //cache: true,
                    //offline: true
                }).then(function (response) {
                    $log.info('setTask: ', response);
                    //callback(response.data);
                });
            }
        };



        var httpStatus = -1;

        function initExecuteQueue(change) {

            // execute cmd from queue
            $http({
                url: 'http://api.dev2.bit-ask.com/index.php/event/all',
                method: 'POST',
                data: change.change.doc.data,
                //cache: true,
                //offline: true
            }).then(function (response) {

                $log.info('onChangeQueue http response: ', response);
                console.log('onChangeQueue http response.status: ', response.status);
                httpStatus = response.status;
                //callback(response.data);

                // lis all docs in db
                dbqueue.allDocs({
                    include_docs: true,
                    attachments: true
                }).then(function (result) {
                    // handle result
                    console.log("onChangeQueue dbqueue.allDocs result: ", result);
                }).catch(function (err) {
                    console.log(err);
                });


                console.log("onChangeQueue change.change.id: ", change.change.id);
                console.log("onChangeQueue change: ", change);

                console.log("onChangeQueue httpStatus: ", httpStatus);
                if (httpStatus == 200) {
                    // delete task from queue
                    dbqueue.get(change.change.id).then(function(doc) {
                        //console.log("dbqueue.get doc: ", doc);
                        return dbqueue.put({
                            _id: change.change.id,
                            _rev: doc._rev,
                            //deleted: true
                        });
                    }).then(function(response) {
                        // handle response
                        console.log("onChangeQueue dbqueue.get response", response);
                    }).catch(function (err) {
                        console.log("onChangeQueue dbqueue.get err", err);
                    });
                };

                // remove
                /*dbqueue.get(change.change.id).then(function(doc) {
                    return dbqueue.remove(doc);
                }).then(function (result) {
                    // handle result
                    console.log("onChangeQueue remove result: ", result);
                }).catch(function (err) {
                    console.log("onChangeQueue remove err: ", err);
                });*/

            });
        }


        // queue changed
        function onChangeQueue(change) {
            $rootScope.queues.push(change);

            console.log("onChangeQueue change: ", change);
            console.log("onChangeQueue change.change.id: ", change.change.id);
            if (online === true) {
                //initExecuteQueue(change);
            };
            
        }

        var options = {
            /*eslint-disable camelcase */
            include_docs: true,
            /*eslint-enable camelcase */
            live: true,
            filter: function (doc) {
                // "_deleted":true
                return doc.deleted === false;
            }
        };

        dbqueue.changes(options).$promise
            .then(null, null, onChangeQueue);








        function deleteTask(id) {
            console.log("deleteTask id: ", id);
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


        function sendData() {
            var uuid = 'ba1eb446-0bb3-ab0a-3e44-a182fc48d720';
            var data = [[1, false, "task/addtask", {"id": uuid, "taskName": 'new task 456'}]];
            this.send(data, console.log("ok"));
        }
        /**
         * Отправить запрос на сервер, ответ обрабатывает callback
         * @param data - данные в формате [id, false, "task/openedtasks", {parentId:0}]
         * @param callback
         */
        self.send = function (data, callback){

            if (online === true) {
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
                                $log.warn(response.data[i][1][1]);
                            }
                        }
                    }
                });

            } else {

                console.log("data: ", data[0][3]);
                var uuid = data[0][3]['id'];
                console.log("uuid: ", uuid);
                dbqueue.put({
                    _id: uuid,
                    data: data,
                    deleted: false
                }).then(function (response) {
                    // handle response

                    // list all docs in db
                    dbqueue.allDocs({
                        include_docs: true,
                        attachments: true
                    }).then(function (result) {
                        // handle result
                        console.log("setTask dbqueue.allDocs result: ", result);
                    }).catch(function (err) {
                        console.log(err);
                    });

                }).catch(function (err) {
                    console.log(err);
                });

            }

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





        function executeCmdFromQueue() {

                dbqueue.find({
                    selector: {deleted: false},
                    fields: ['_id', 'data']
                }).then(function (result) {
                    // yo, a result
                    console.log("dbqueue.find result: ", result);
                    // execute cmd from queue
                    console.log("result.docs: ", result.docs[0]['data']);

                    console.log("result.docs.length: ", result.docs.length);

                    angular.forEach(result.docs, function(value, key) {
                        console.log(key + ': ' + value['data']);
                        //for (var i = 0; i < result.docs.length; i++) {
                        //
                        //data = result.docs[i]['data'];
                        //initExecuteQueue(data);
                        console.log("START LOOP");


                        $http({
                            url: 'http://api.dev2.bit-ask.com/index.php/event/all',
                            method: 'POST',
                            data: value['data'],
                            //cache: true,
                            //offline: true
                        }).then(function (response) {

                            $log.info('connectionStatus http response: ', response);
                            console.log('connectionStatus http response.status: ', response.status);
                            httpStatus = response.status;
                            //callback(response.data);

                            // lis all docs in db
                            dbqueue.allDocs({
                                include_docs: true,
                                attachments: true
                            }).then(function (result) {
                                // handle result
                                console.log("connectionStatus dbqueue.allDocs result: ", result);
                            }).catch(function (err) {
                                console.log(err);
                            });


                            console.log("connectionStatus value: ", value);
                            console.log("connectionStatus value['data']: ", value['data']);
                            console.log("connectionStatus value['_id']: ", value['_id']);
                            //console.log("result.docs[i]['data']: ", result.docs[i]['data']);
                            //console.log("result.docs[0]: ", result.docs[0]);
                            //console.log("i: ", i);
                            //console.log("result.docs[i]: ", result.docs[i]);

                            console.log("connectionStatus httpStatus: ", httpStatus);
                            if (httpStatus == 200) {
                                // delete task from queue
                                dbqueue.get(value['_id']).then(function(doc) {
                                    //console.log("dbqueue.get doc: ", doc);
                                    return dbqueue.put({
                                        _id: value['_id'],
                                        _rev: doc._rev,
                                        //deleted: true
                                    });
                                }).then(function(response) {
                                    // handle response
                                    console.log("connectionStatus dbqueue.get response", response);
                                }).catch(function (err) {
                                    console.log("connectionStatus dbqueue.get err", err);
                                });
                            };

                            // remove
                            /*dbqueue.get(change.change.id).then(function(doc) {
                                return dbqueue.remove(doc);
                            }).then(function (result) {
                                // handle result
                                console.log("onChangeQueue remove result: ", result);
                            }).catch(function (err) {
                                console.log("onChangeQueue remove err: ", err);
                            });*/
                        }); 
                        console.log("END LOOP");
                    });
                }).catch(function (err) {
                    // ouch, an error
                    console.log("dbqueue.find err: ", err);
                });
        }


        var online = true;
        connectionStatus.$on('online', function () {
            $log.info('bufferService: We are now online');
            online = true;
            $timeout(executeCmdFromQueue, 30000);
            //initExecuteQueue();
        });

        connectionStatus.$on('offline', function () {
            $log.info('bufferService: We are now offline');
            online = false;
        });

        

        


    











}])

.run(function ($http, $cacheFactory, CacheFactory, offline, connectionStatus, $log, $rootScope, bufferService) {

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

    /*connectionStatus.$on('online', function () {
        $log.info('bufferService: We are now online');

        //bufferService.initExecuteQueue();
    });*/

    

    $rootScope.test = 'It works! Using ' + (CacheFactory ? 'angular-cache' : 'undefined');


});

