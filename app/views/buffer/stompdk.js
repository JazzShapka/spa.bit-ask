var stompdk = angular.module('stompdk', [ 'AngularStompDK' ]);

stompdk.config(
	function(ngstompProvider, $routeProvider){
            ngstompProvider
                .url('http://bitask-dev5.app.kras.1cbit.ru:15674/stomp')
                .credential('guest', 'guest')
                //.debug(true)
                .vhost('/')
                .heartbeat(0, 0)
                .class(SockJS); // <-- Will be used by StompJS to do the connection

            $routeProvider.
      		when('/stomp', {
        		templateUrl: 'app/views/buffer/buffer.html',
        		controller: 'stompdkController'
      		});

        });

stompdk.controller('stompdkController', function($scope, ngstomp) {

	console.log("STOMP START: ");
    var items = [];

    ngstomp
        .subscribeTo('/queue/queue')
            .callback(whatToDoWhenMessageComming)
        .connect()

    function whatToDoWhenMessageComming(message) {
        items.push(JSON.parse(message.body));
        console.log("items: ", items);
        console.log("STOMP message: ", message);
        console.log("STOMP message.body: ", message.body);
    }
});
