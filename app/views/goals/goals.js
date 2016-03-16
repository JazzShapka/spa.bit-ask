'use strict';

angular.module('bitaskApp.goals', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/goals', {
    templateUrl: './app/views/goals/goals.html',
    controller: 'GoalsCtrl'
  });
}])

.controller('GoalsCtrl', [function() {

}]);