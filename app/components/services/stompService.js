'use strict';

/**
 * Created by WebStorm.
 * User: ANLyhin
 * Date: 04.03.2016
 * Time: 16:52
 */

var stompService = angular.module('stompService', [ 'AngularStompDK' ]);

stompService.config(
	function(ngstompProvider, $routeProvider){
            ngstompProvider
                .url('http://bitask-dev5.app.kras.1cbit.ru:15674/stomp')
                .credential('guest', 'guest')
                .debug(true)
                .vhost('/')
                .heartbeat(0, 0)
                .class(SockJS); // <-- Will be used by StompJS to do the connection

            /*$routeProvider.
      		when('/stomp', {
        		templateUrl: 'app/views/buffer/stompdk.html',
        		controller: 'stompdkController'
      		});*/

        });


stompService.service('stompService', ['ngstomp', '$auth', '$rootScope', 'pouchDB', 'uuid4', 'taskService',
	function(ngstomp, $auth, $rootScope, pouchDB, uuid4, taskService) {

	console.log("Start stompService.");

    var db = pouchDB('dbname');

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
        console.log("event: ", event);
        //console.log(event.id);
        
        /*db.put({
            _id: event.id,
            title: 'Taskname'
        });*/

        // update data in db
        db.get(event.id).then(function(doc) {
          return db.put({
            _id: event.id,
            _rev: doc._rev,
            title: event.taskName
          });
        }).then(function(response) {
          // handle response
          db.allDocs({include_docs: true, descending: true}, function(err, doc) {
            console.log(doc.rows);
          });
          // send message body to service
          taskService.send(message.body);
        }).catch(function (err) {
          console.log(err);
        });

        


    }
}]);
