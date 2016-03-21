'use strict';

angular.module('bitaskApp.goals', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/goals', {
    templateUrl: './app/views/goals/goals.html',
    controller: 'GoalsCtrl'
  });
}])

.controller('GoalsCtrl', [ '$scope', function($scope) {

	//$scope.targets = [];
	$scope.targets = ['target 1', 'target 2'];
	console.log($scope.targets);

	//bufferService.getTasks();

}]);