'use strict';

/* Services */

/**
 * Created by WebStorm.
 * User: ANLyhin
 * Date: 03.03.2016
 * Time: 10:25
 */

var bufferService = angular.module('bufferService', ['ngResource', 'uuid4']);

bufferService.service('bufferService', ['$resource', '$http', '$auth', 'uuid4',
    function($resource, $http, $auth, uuid4) {
        console.log("Start bufferService.");

        //debugger;
        //console.log ($auth.getToken());
        console.log ("getPayload: ", $auth.getPayload().sub);

        var self = this;
        var uid = $auth.getPayload().sub;



        this.getTasks = getTasks;
        this.setTask = setTask;
        this.getId = getId;
        
        /* service */
        function getTasks(callback) {
            $http({
                url: 'http://api.dev2.bit-ask.com/index.php/event/all',
                method: 'POST',
                data: '[[1, false, "task/subtasks", {"parentId": 0}]]'
            }).then(function successCallback(response) {
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
                data: data
            }).success(function (data, status, header, config) {
                callback(data);
            });
        };

        function getId(callback) {
            $http({
                url: 'http://api.dev2.bit-ask.com/index.php/event/all',
                method: 'POST',
                data: '[[1, false, "user/getid"]]'
            }).success(function (data, status, header, config) {
                callback(data);
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
                data: [data]
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




        /*
        var obj = {};
        obj.getCard = function(par) {
            
            // http://api.dev2.bit-ask.com/index.php/event/all
            var CreditCard = $resource('http://api.dev2.bit-ask.com/index.php/event/all/u/:userId/c/:cardId',
            //var CreditCard = $resource('http://api.dev2.bit-ask.com/index.php/event/all',
            {userId:par, cardId:'@id'}, {
                charge: {method:'POST', params:{charge:true}}
            });

            var newCard = new CreditCard({number:par});
            newCard.name = "Mike Smith";
            newCard.$save();

            console.log("newCard: ",  newCard);
            return newCard;
        }

        // POST: /user/123/card {number:'0123', name:'Mike Smith'}
        // server returns: {id:789, number:'0123', name: 'Mike Smith'};
        obj.getBooks = function() {
            console.log("getBooks: ");
            serviceBase = 'http://api.dev2.bit-ask.com/index.php/event/';
            return $http.get(serviceBase + 'all');
        }

        obj.setTask = function (parentId) {
            $uuid = uuid4.generate();
            console.log ("uuid: ", uuid4.generate());
            data = [[1, false, "task/addtask", {"id": $uuid, "authorId": $uid, "taskName": "tName"}]];
            var req = {
                method: 'POST',
                url: 'http://api.dev2.bit-ask.com/index.php/event/all',
                headers: {
                    //'Content-Type': undefined
                    //'Access-Control-Allow-Origin': '*'
                    //'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                //data: { message: 'task/subtasks', parentId: parentId, k: { keysid: '123' } }
                //data: '[[1, false, "task/addtask", {"id": $uid, "authorId": 3, "taskName": 4}]]'
                data: data
            }

            $http(req).then(function(result){ console.log(result); }, function(){});
        }
        obj.getTasks = function (parentId) {
            var tasks = [467, 123];
            var req = {
                method: 'POST',
                url: 'http://api.dev2.bit-ask.com/index.php/event/all',
                headers: {
                    //'Access-Control-Allow-Origin': '*'
                    //'Content-Type': undefined
                    //'Content-Type': 'application/json; charset=UTF-8'
                    //'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                //data: { message: 'task/subtasks', parentId: parentId, k: { keysid: '123' } }
                data: '[[1, false, "task/subtasks", {"parentId": 0}]]'
            }

            $http(req).then(function(result) {
                console.log(result.data[0][2]);
                //return result.data[0][2];
                //return 123;
                tasks = result.data[0][2];
                //return 123456;
            }, function(){});
            console.log ("tasks1:", tasks);
            return tasks;
        }
        obj.test = function (parentId) {
            var req = {
                method: 'POST',
                url: 'http://api.dev2.bit-ask.com/index.php/event/all',
                headers: {
                    //'Access-Control-Allow-Origin': '*'
                    //'Content-Type': undefined
                    //'Content-Type': 'application/json; charset=UTF-8'
                    //'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                //data: { message: 'task/subtasks', parentId: parentId, k: { keysid: '123' } }
                data: '[[1,false,"task/subtasks",{"parentId":"123"}]]'
            }

            $http(req).then(function(result){ console.log(result); }, function(){});
        }
        return obj;*/
}])
