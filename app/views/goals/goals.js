'use strict';

angular.module('bitaskApp.goals', ['ngRoute', 'ngMaterial', 'bitaskApp.service.goal'])

.config(['$routeProvider', '$mdIconProvider', function($routeProvider, $mdIconProvider) {
  $routeProvider.when('/goals', {
    templateUrl: './app/views/goals/goals.html',
    controller: 'GoalsCtrl'
  });
}])

.controller('GoalsCtrl', [ '$scope', 'bufferService', 'goalService', 'uuid4', '$mdDialog', 
	function($scope, bufferService, goalService, uuid4, $mdDialog) {

	$scope.targets = goalService.goals;
	//$scope.fromGoalDate = new Date();

	/**
	 * Изменилась дата
	 */
	$scope.changeGoalDate = function() {
		console.log("change fromGoalDate: ", $scope.fromGoalDate);
		console.log("change toGoalDate: ", $scope.toGoalDate);
	};

}]);