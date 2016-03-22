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
    'pouchdb',
    'AngularStompDK'])

.config(function ($httpProvider, ngstompProvider) {

    // Получить url без слеша в конце
    var url = bitaskAppConfig.socket_url;
    if(url[url.length-1] == '/')
        url = url.slice(0, -1);

    // Настройка веб сокетов
    ngstompProvider
        .url(url + ':'+ bitaskAppConfig.api_socket_port +'/ws')
        .credential('guest', 'guest')
        .debug(true)
        .vhost('/')
        .heartbeat(0, 0)
        .class(WebSocket); // <-- Will be used by StompJS to do the connection


})

.service('bufferService', [
    '$http', '$auth', 'uuid4', '$log', 'pouchDB', '$timeout', '$rootScope', '$mdToast', 'ngstomp', //ngstomp
    function($http, $auth, uuid4, $log, pouchDB, $timeout, $rootScope, $mdToast, ngstomp) {

        var self = this;

        var db_data = pouchDB('data');              // БД для данных (задачи, встречи, структура, ...)
        var db_queue = pouchDB('queue');            // БД для очереди (сохранение запросов при оффлайне)




        /**
         * Отправить запрос на сервер, ответ обрабатывает callback
         * @param data - данные в формате [[id, false, "task/openedtasks", {parentId:0}],[...],[...]]
         * @param callback
         */
        self.send = function (data, callback){

            /**
             * Обработчик удаченого ответа сервера
             * @param response
             */
            var successCallback = function (response){
                if(response.status !== 200)
                {
                    errorCallback(response);
                    return;
                }

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
            };

            /**
             * Обработчик ошибки
             * @param response
             */
            var errorCallback = function (response){

                debugger;

                for(var i=0; i<data.length; i++)
                {
                    if(data[i][1])  // Проверяем, нужно ли кешировать запрос
                    {
                        db_queue.put(data[i]).then(function (){
                            debugger;
                        })
                    }

                }

                /*db_queue.put({
                    data: data
                }).then(function (response) {

                    db_queue.allDocs({
                        include_docs: true,
                        attachments: true
                    }).then(function (result) {
                        // handle result
                        //console.log("send dbqueue.allDocs result: ", result);
                    }).catch(function (err) {
                        //console.log(err);
                    });

                }).catch(function (err) {

                });*/
            };

            $http({
                url: bitaskAppConfig.api_url + 'index.php/event/all',
                method: 'POST',
                data: data
            })
                .then(successCallback, errorCallback);
        };



        /**
         * Отчиска БД для данных
         *
         * Просто удаляет базу и создает ее снова
         *
         * @description Clear all data in db.
         */
        var clearDataDB = function () {

            db_data.destroy().then(function() {
                db_data = pouchDB('data');
            });
        };
        /**
         * Отчиска БД для очереди
         *
         * Просто удаляет базу и создает ее снова
         *
         * @description Clear all data in db.
         */
        var clearQueueDB = function (){
            db_queue.destroy().then(function() {
                db_queue = pouchDB('queue');
            });
        };

        var testOnline = function (){

        };


        /**
         * @description Get all task from server and put all to db | Загрузка данных с сервера в бд
         */
        function getTasks() {

            //resetdb();
            db_data.allDocs({include_docs: true, descending: true}, function(err, doc) {
                //console.log("getTasks doc.rows: ", doc.rows);
            });

            //localStorageService.set('key124', JSON.stringify(callback));
            //console.log(JSON.stringify(callback));
            //console.log ("LSget: ", localStorageService.get('key124'));
            //console.log("Keys: ", localStorageService.keys());

            $http({
                url: 'http://api.dev2.bit-ask.com/index.php/event/all',
                method: 'POST',
                data: '[[1,false,"task/subtasks",{"parentId":"0"}]]'
                //cache: true,
                //offline: true
            }).then(function successCallback(response) {
                //$log.info('getTasks response: ', response);


                //console.log(response.data[0][2][0]['id']);
                
                
                // LOOP: put response to db
                //console.log("length: " , response.data[0][2].length);
                for (var i = 0; i < response.data[0][2].length; i++) {
                    //delay(deleteTask(response.data[0][2][i]['id']), 2000);

                    //$timeout(deleteTask(response.data[0][2][i]['id']), 1000);

                    //deleteTask(response.data[0][2][i]['id']);
                    //console.log("getTasks id: ", response.data[0][2][i]['id']);
                    //console.log("getTasks taskName", response.data[0][2][i]['taskName']);

                    db_data.put({
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
                        //console.log("getTasks response: ", response);
                        db_data.allDocs({include_docs: true, descending: true}, function(err, doc) {
                            //console.log("getTasks OK doc.rows: ", doc.rows);
                        });
                    }).catch(function (err) {
                        //console.log("getTasks err: ", err);
                        db_data.allDocs({include_docs: true, descending: true}, function(err, doc) {
                            //console.log("getTasks ERR doc.rows: ", doc.rows);
                        });
                    });
                }
                //callback(response.data);
            }, function(rejectReason) {
                //console.log('failure');
            });
        }

        
        /**
         * @description Processing queue | Обработка очереди
         */
        function processingQueue() {

            db_queue.find({
                    selector: {deleted: false},
                    fields: ['_id', 'data']
                }).then(function (result) {


                    angular.forEach(result.docs, function(value, key) {

                        $http({
                            url: 'http://api.dev2.bit-ask.com/index.php/event/all',
                            method: 'POST',
                            data: value['data']
                        }).then(function (response) {

                            db_queue.allDocs({
                                include_docs: true,
                                attachments: true
                            }).then(function (result) {
                                // handle result
                                //console.log("connectionStatus dbqueue.allDocs result: ", result);
                            }).catch(function (err) {
                                //console.log(err);
                            });

                            if (response.status == 200) {


                                db_queue.get(value['_id']).then(function(doc) {
                                    return db_queue.remove(doc);
                                }).then(function (result) {
                                    // handle result
                                    //console.log("processingQueue remove result: ", result);
                                }).catch(function (err) {
                                    //console.log("processingQueue remove err: ", err);
                                });

                            }
                            
                        }); 
                        //console.log("END LOOP");
                    });
                }).catch(function (err) {
                    // ouch, an error
                    //console.log("dbqueue.find err: ", err);
                });
        }



        /**
         * Конструктор
         */
        var __constructor = function () {

            var uid = $auth.getPayload().sub;

            //clearQueueDB();
            //clearDataDB();

            ngstomp
                .subscribeTo('/queue/' + uid)
                .callback(function (message){
                    debugger;
                })
                .connect();

            processingQueue();
            getTasks();
        };
        __constructor();


    }])

.run(function ($log, $rootScope) {

    //offline.start($http);
});

