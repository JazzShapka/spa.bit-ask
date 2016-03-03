'use strict';

/* Services */

/**
 * Created by WebStorm.
 * User: ANLyhin
 * Date: 20.02.2016
 * Time: 16:23
 */

var bitaskServices = angular.module('bitaskServices', ['ngResource']);

bitaskServices.service('sessionService', function($stomp, $rootScope) {

    // Connect to the server on path /sockjs and then create
    // the STOMP protocol client
    var socket = new SockJS('http://' + window.location.hostname + ':15674/stomp');
    var stompClient = Stomp.over(socket);

    stompClient.heartbeat.outgoing = 20000; // client will send heartbeats every 20000ms
    stompClient.heartbeat.incoming = 0;

    stompClient.connect('guest', 'guest',
        function(frame) {
            // receive notifications on the recog/sessions topic
            stompClient.subscribe("/amq/queue/queue_name_from_server", function(message) {
                $rootScope.$apply(function() {
                    //$scope.sessions = angular.fromJson(message.body);
                    $rootScope.sessions = message.body;
                    //sessions = message.body;
		            //console.log("scope.sessions: " + $scope.sessions);
                });
            });
        },
        function(error) {
            console.log("STOMP protocol error " + error);
        }
    );

    this.sendMessage = function(message) {
	stompClient.send("/amq/queue/queue_name_to_server2", {"content-type":"text/plain"}, message);
    };
});
