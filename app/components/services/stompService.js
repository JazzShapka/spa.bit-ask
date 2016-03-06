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


stompService.service('stompService', ['ngstomp',
	function(ngstomp) {

	console.log("Start stompService.");
    //$scope.bufferService = bufferService;

	//var uid = $auth.getPayload().sub;
	//console.log("uid: ", uid);
    //var uid = '123';

    //var items = [];
    var vm = this, headers = {
            foo : 'bar'            
        };
    vm.items = [];

    //$scope.bufferService = bufferService;
    //var id = 789;
    /*bufferService.getId(function(data) {
      //var id = data[0][2];
      console.log("id: ", data[0][2]);
      stompSubscribe(data[0][2]);
      //console.log(ide);
    });*/
    //console.log("ide: ", ide);

    /*$scope.bufferService = bufferService;
    bufferService.getTasks(function(data) {
      $scope.tasks = data;
      console.log("data456: ", data);
    });*/

    this.stompSubscribe = stompSubscribe;

    function stompSubscribe(id) {
	    ngstomp
	        //.subscribeTo('/queue/queue')
	            //.callback(whatToDoWhenMessageComming)
	            //.withHeaders(headers)
	            //.and()
	        .subscribeTo('/queue/' + id)
	            .callback(whatToDoWhenMessageComming)
	            .withHeaders(headers)
	        .connect();
    }

    function whatToDoWhenMessageComming(message) {

        //items.push(JSON.parse(message.body));
        //vm.items.push(JSON.parse(message.body));
        vm.items.push(message.body);
        $scope.items = vm.items;
        console.log("items: ", vm.items);
        console.log("STOMP message: ", message);
        console.log("STOMP message.body: ", message.body);
    }
    //console.log("items: ", vm.items);
    //console.log("STOMP message: ", vm.message);
    //console.log("STOMP message.body: ", vm.message.body);
}]);
