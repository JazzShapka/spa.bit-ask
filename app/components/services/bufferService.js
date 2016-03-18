'use strict';

/* Services */

/**
 * Created by WebStorm.
 * User: ANLyhin
 * Date: 03.03.2016
 * Time: 10:25
 */

angular.module('bitaskApp.service.buffer', [
    'uuid4',
    'offline',
    'pouchdb',
    'AngularStompDK'])

.config(function (
        //offlineProvider,
        //$provide,
        $httpProvider
    ) {
    
    //offlineProvider.debug(true);

        // Interceptors
        $httpProvider.interceptors.push(['$location', '$injector', '$q', '$rootScope', function ($location, $injector, $q, $rootScope) {
            return {
                'request': function (config) {
                    console.log("INTERCEPTORS request 1", config);
                    //add headers
                    return config;
                },

                // optional method
               'requestError': function(rejection) {
                    console.log("INTERCEPTORS requestError 2", rejection);
                    // do something on error
                    return $q.reject(rejection);
                },

                // optional method
                'response': function(response) {
                    console.log("INTERCEPTORS response 3", response);
                    if (response.status === -1) {
                        //console.log("INTERCEPTORS 3 status: ", response.status);
                        $rootScope.online = false;
                        console.log("$rootScope.online f: ", $rootScope.online);
                    } else {
                        $rootScope.online = true;
                        console.log("$rootScope.online t: ", $rootScope.online);    
                    };
                    // do something on success
                    // $rootScope.online = true;
                    return response;
                },

                'responseError': function (rejection) {
                    console.log("INTERCEPTORS responseError 4", rejection);
                    $rootScope.online = false;
                    console.log("$rootScope.online: f", $rootScope.online);
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
        }]);
})

.service('bufferService', [
        '$http',
        '$auth',
        'uuid4',
        //'offline',
        'connectionStatus',
        '$log',
        'pouchDB',
        '$timeout',
        '$rootScope',
        'ngstomp',
        'dbService',
        '$mdToast',
    function(
        $http,
        $auth,
        uuid4,
        //offline,
        connectionStatus,
        $log,
        pouchDB,
        $timeout,
        $rootScope,
        ngstomp,
        dbService,
        $mdToast) {

        //console.log = function() {};
        console.log("Start bufferService.");

        $rootScope.docs = [];
        $rootScope.queues = [];

        var self = this;
        var uid = $auth.getPayload().sub;
        var db = dbService.getDb();

        this.getTasks = getTasks;
        this.setTask = setTask;
        //this.getId = getId;
        this.deleteTask = deleteTask;
        this.sendData = sendData;



        /**
         * Clear all data in db | Очистка бд
         */
        var resetdb = function() {
            db.destroy().then(function() {
                db = dbService.getDb();
            });
        };
        //resetdb();

        /**
         * Listen to database changes | Слушатель изменений данных в бд
         */
        function onChange(change) {
            $rootScope.docs.push(change);
        }

        /**
         * Options for listen | Опции для слушателя
         */
        var options = {
            /*eslint-disable camelcase */
            include_docs: true,
            /*eslint-enable camelcase */
            live: true
        };

        /**
         * DB canges event listener | Слушатель для бд
         */
        db.changes(options).$promise
            .then(null, null, onChange);

        /**
         * Load data from server to db | Загрузка данных с сервера в бд
         */
        getTasks();


        /**
         * Get all task from server over http post and put all to db | Загрузка данных с сервера в бд
         */
        function getTasks() {

            //resetdb();
            db.allDocs({include_docs: true, descending: true}, function(err, doc) {
                console.log("getTasks doc.rows: ", doc.rows);
            });

            //localStorageService.set('key124', JSON.stringify(callback));
            //console.log(JSON.stringify(callback));
            //console.log ("LSget: ", localStorageService.get('key124'));
            //console.log("Keys: ", localStorageService.keys());

            $http({
                url: 'http://api.dev2.bit-ask.com/index.php/event/all',
                method: 'POST',
                data: '[[1,false,"task/subtasks",{"parentId":"0"}]]',
                //cache: true,
                //offline: true
            }).then(function successCallback(response) {
                $log.info('getTasks response: ', response);


                //console.log(response.data[0][2][0]['id']);
                
                
                // LOOP: put response to db
                //console.log("length: " , response.data[0][2].length);
                for (var i = 0; i < response.data[0][2].length; i++) {
                    //delay(deleteTask(response.data[0][2][i]['id']), 2000);

                    //$timeout(deleteTask(response.data[0][2][i]['id']), 1000);

                    //deleteTask(response.data[0][2][i]['id']);
                    console.log("getTasks id: ", response.data[0][2][i]['id']);
                    console.log("getTasks taskName", response.data[0][2][i]['taskName']);

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
                        console.log("getTasks response: ", response);
                        db.allDocs({include_docs: true, descending: true}, function(err, doc) {
                            console.log("getTasks OK doc.rows: ", doc.rows);
                        });
                    }).catch(function (err) {
                        console.log("getTasks err: ", err);
                        db.allDocs({include_docs: true, descending: true}, function(err, doc) {
                            console.log("getTasks ERR doc.rows: ", doc.rows);
                        });
                    });
                };
                //callback(response.data);
            }, function(rejectReason) {
                console.log('failure');
            });
        };

        /**
         * Test create task | Тест создание задачи
         */
        function setTask(taskName) {
            console.log("setTask");
            //var uuid = uuid4.generate();
            var uuid = 'ba1eb446-0bb3-ab0a-3e44-a182fc48d724';
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

        /**
         * Test delete task | Удаление задачи
         */
        function deleteTask(id) {
            console.log("deleteTask id: ", id);
            var data = [[1, false, "task/deletetask", {"id": id}]];
            //console.log ("data: ", data);
            $http({
                url: 'http://api.dev2.bit-ask.com/index.php/event/all',
                method: 'POST',
                data: data,
                //cache: true,
                //offline: true
            }).then(function (response) {
                $log.info('deleteTask: ', response);
                //callback(response.data);
            });
        };

        /**
         * Test get userd id from server db.
         */
        /*function getId(callback) {
            $http({
                url: 'http://api.dev2.bit-ask.com/index.php/event/all',
                method: 'POST',
                data: '[[1, false, "user/getid"]]',
                //cache: true,
                //offline: true
            }).then(function (response) {
                $log.info('getId: ', response);
                callback(response.data);
            });  
        };*/

        /**
         * Test send | Тест отправда данных на сервер
         */
        function sendData() {
            var uuid = 'ba1eb446-0bb3-ab0a-3e44-a182fc48d724';
            var data = [[1, false, "task/addtask", {"id": uuid, "taskName": 'new task 23'}]];
            this.send(data, console.log("ok"));
        }

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

                    console.log("send $rootScope.online: ", $rootScope.online);

                    if ( $rootScope.online ) {

                        for (var i=0; i<response.data.length; i++)
                        {
                            if(response.data[i][1][0] == 200)
                            {
                                if(typeof callback == 'function')
                                {
                                    callback (response.data[i][2]);
                                }
                            }
                            else
                            {
                                $log.warn(response.data[i][1][1]);
                                $mdToast.show({
                                    template: '<md-toast><span style="color:red">Error:&nbsp;</span><span flex>'+ response.data[i][1][1] +'</span></md-toast>',
                                    hideDelay: 10000,
                                    position: 'right bottom'
                                });
                            }
                        }

                    } else {

                        // put query to db
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
                                console.log("send dbqueue.allDocs result: ", result);
                            }).catch(function (err) {
                                console.log(err);
                            });

                        }).catch(function (err) {
                            console.log(err);
                        });

                    }
                });

        };



        /*   QUEUE SERVICE  | Работа с очередью   */

        var httpStatus = -1;
        var dbqueue = pouchDB('queue');
        var online = true;

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

        /**
         * Сreate index | Создание индекса
         */
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

        /*dbqueue.find({
            selector: {deleted: false},
            fields: ['_id', 'data']
        }).then(function (result) {
            // yo, a result
            console.log("dbqueue.find result: ", result);
        }).catch(function (err) {
            // ouch, an error
            console.log("dbqueue.find err: ", err);
        });*/

        /**
         *  For event listener
         */
        /*function initExecuteQueue(change) {

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
                dbqueue.get(change.change.id).then(function(doc) {
                    return dbqueue.remove(doc);
                }).then(function (result) {
                    // handle result
                    console.log("onChangeQueue remove result: ", result);
                }).catch(function (err) {
                    console.log("onChangeQueue remove err: ", err);
                });

            });
        }*/

        /**
         * Execute if changes in db queue | Выполняется если в бд произошли изменения
         */
        function onChangeQueue(change) {
            $rootScope.queues.push(change);

            console.log("onChangeQueue change: ", change);
            console.log("onChangeQueue change.change.id: ", change.change.id);
            if (online === true) {
                //initExecuteQueue(change);
            };  
        }

        /**
         * Options for listener | Опции для слушателя
         */
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

        /**
         * Listen to database changes | Слушатель для изменений в бд
         */
        dbqueue.changes(options).$promise
            .then(null, null, onChangeQueue);

        processingQueue();
        /**
         * Processing queue | Обработка очереди
         */
        function processingQueue() {

                dbqueue.find({
                    selector: {deleted: false},
                    fields: ['_id', 'data']
                }).then(function (result) {
                    // yo, a result
                    console.log("dbqueue.find result: ", result);
                    // execute cmd from queue
                    console.log("result.docs: ", result.docs[0]['data']);

                    console.log("result.docs.length: ", result.docs.length);

                    angular.forEach(result.docs, function(value, key) {          console.log(key + ': ' + value['data']);
                        //for (var i = 0; i < result.docs.length; i++){
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

                                // update task from queue
                                /*dbqueue.get(value['_id']).then(function(doc) {
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
                                });*/

                                // remove
                                dbqueue.get(value['_id']).then(function(doc) {
                                    return dbqueue.remove(doc);
                                }).then(function (result) {
                                    // handle result
                                    console.log("processingQueue remove result: ", result);
                                }).catch(function (err) {
                                    console.log("processingQueue remove err: ", err);
                                });

                            };
                            
                        }); 
                        console.log("END LOOP");
                    });
                }).catch(function (err) {
                    // ouch, an error
                    console.log("dbqueue.find err: ", err);
                });
        }

        /**
         * Event online | Событие есть подключение
         */
        connectionStatus.$on('online', function () {
            $log.info('bufferService: We are now online');
            //online = true;
            $rootScope.online = true;
            $timeout(processingQueue, 30000);
            //initExecuteQueue();
        });

        /**
         * Event offline | Собитие нет подключения
         */
        /*connectionStatus.$on('offline', function () {
            $log.info('bufferService: We are now offline');
            $rootScope.online = false;
            //online = false;
        });*/

}])

.run(function ($log, $rootScope) {

    //offline.start($http);
});

