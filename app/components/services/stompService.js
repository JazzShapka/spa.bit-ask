'use strict';

/**
 * Created by WebStorm.
 * User: ANLyhin
 * Date: 04.03.2016
 * Time: 16:52
 */

var stompService = angular.module('stompService', [ 'AngularStompDK' ]);

stompService.config(
	function(ngstompProvider){
            ngstompProvider
                .url('http://bitask-dev5.app.kras.1cbit.ru:15674/stomp')
                .credential('guest', 'guest')
                //.debug(true)
                .vhost('/')
                .heartbeat(0, 0)
                .class(SockJS); // <-- Will be used by StompJS to do the connection

            /*$routeProvider.
      		when('/stomp', {
        		templateUrl: 'app/views/buffer/stompdk.html',
        		controller: 'stompdkController'
      		});*/

        });


stompService.service('stompService', ['ngstomp', '$auth', '$rootScope', 'pouchDB', 'uuid4', 'taskService', 'dbService',
	function(ngstomp, $auth, $rootScope, pouchDB, uuid4, taskService, dbService) {

	//console.log("Start stompService.");

	var uid = $auth.getPayload().sub;
    var items = [];


    // connect and subscribe
	ngstomp
	    //.subscribeTo('/queue/all')
	        //.callback(whatToDoWhenMessageComming)
	        //.and()
        .subscribeTo('/queue/' + uid)
	        .callback(whatToDoWhenMessageComming)
            .bindTo($rootScope)
	    .connect();

    /**
     * Execute every message received
     */
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
        //console.log("event 0: ", event[0]);
        //console.log("event 1: ", event[1]);
        //console.log("event 2 id: ", event[2]['id']);
        //console.log("event 2 taskName: ", event[2]['taskName']);
        //console.log('event 2 1: ', event[2][1]);
        var keys = Object.keys(event[2]);
        //console.log("keys: ", keys);
        //console.log("key 1: ", keys[1]);
        //var key = keys[1];
        

        // update data in db
        var db = dbService.getDb();
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

}]);
