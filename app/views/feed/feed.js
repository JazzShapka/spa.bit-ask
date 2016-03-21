'use strict';

angular.module('bitaskApp.index', ['ngRoute', 'bitaskApp.service.keyboard', 'bitaskApp.service.feed'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
      templateUrl: './app/views/feed/feed.html',
      controller: 'FeedCtrl'
  });
}])

.controller('FeedCtrl', ['$scope', '$http', 'feedService', 'keyboardService',
    function($scope, $http, feedService, keyboardService) {

        $scope.feeds = feedService.feeds;


        keyboardService.on(function (){
            $scope.$apply();
            console.log('index - keypress');
        });
}]);