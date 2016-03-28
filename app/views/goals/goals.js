'use strict';

/**
 * Created by WebStorm.
 * User: ANLyhin
 * Date: 28.03.2016
 * Time: 17:41
 */

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
	 * Изменилась дата глобального периода
	 */
	$scope.onChangeGlobalPeriod = function() {
		console.log("change fromGoalDate: ", $scope.fromGoalDate);
		console.log("timestamp fromGoalDate: ", new Date($scope.fromGoalDate).getTime()/1000);

		console.log("change toGoalDate: ", $scope.toGoalDate);
		console.log("timestamp toGoalDate: ", new Date($scope.toGoalDate).getTime()/1000);
	};

}]);