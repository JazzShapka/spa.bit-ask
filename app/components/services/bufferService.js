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
        console.log ("getPayload: ", $auth.getPayload().sub);
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
            }).then(function (response) {
                callback(response.data);
            });
        };

        function getId(callback) {
            $http({
                url: 'http://api.dev2.bit-ask.com/index.php/event/all',
                method: 'POST',
                data: '[[1, false, "user/getid"]]'
            }).then(function (response) {
                callback(response.data);
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

}])
