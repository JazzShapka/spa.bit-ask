var bufferService = angular.module('bufferService', ['ngResource']);

bufferService.factory('bufferService', ['$resource', '$http', '$auth',
    function($resource, $http, $auth) {
        console.log("bufferService: ");

        //debugger;
        //console.log ($auth.getToken());
        console.log ("P: ", $auth.getPayload().sub);
        $uid = $auth.getPayload().sub;
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

        obj.addTask = function (parentId) {
            data = [[1, false, "task/addtask", {"id": $uid, "authorId": $uid, "taskName": "tName"}]];
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
        obj.subTasks = function (parentId) {
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
                data: '[[1, false, "task/subtasks", {"parentId": 2}]]'
            }

            $http(req).then(function(result){ console.log(result); }, function(){});
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


        return obj;
}])
