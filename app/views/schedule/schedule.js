'use strict';

angular.module('bitaskApp.schedule', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/schedule', {
    templateUrl: './app/views/schedule/schedule.html',
    controller: 'ScheduleCtrl'
  });
}])

.controller('ScheduleCtrl', [function() {

}]);