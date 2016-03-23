'use strict';

angular.module('bitaskApp.goals', ['ngRoute', 'ngMaterial', 'underscore'])

.config(['$routeProvider', '$mdIconProvider', function($routeProvider, $mdIconProvider) {
  $routeProvider.when('/goals', {
    templateUrl: './app/views/goals/goals.html',
    controller: 'GoalsCtrl'
  });
  $mdIconProvider
    .iconSet('social', 'img/icons/sets/social-icons.svg', 24)
    .iconSet('device', 'img/icons/sets/device-icons.svg', 24)
    .iconSet('communication', 'img/icons/sets/communication-icons.svg', 24)
    .defaultIconSet('img/icons/sets/core-icons.svg', 24);
}])

.controller('GoalsCtrl', [ '$scope', 'bufferService', 'uuid4', '$mdDialog', '_', function($scope, bufferService, uuid4, $mdDialog, _) {

	//$scope.targets = [];
	//$scope.targets = ['target 1', 'target 2'];
	//console.log($scope.targets);

	$scope.bufferService = bufferService;
	//$scope.deleteTarget = deleteTarget;
	//var vm = this;
	//vm.deleteTarget = deleteTarget;

	$scope.doSecondaryAction = function(event) {
    	$mdDialog.show(
      		$mdDialog.alert()
		        .title('Secondary Action')
		        .textContent('Secondary actions can be used for one click actions')
		        .ariaLabel('Secondary click demo')
		        .ok('Neat!')
		        .targetEvent(event)
	    );
  	};

	/**
	 * Загружаем все цели
	 */
	function getAllTarget() {
		var alldata = '[[1,false,"task/subtasks",{"parentId":"0"}]]';
		bufferService.send(alldata, function(data) {
	        //console.log("selfsend: ", data);
	        $scope.targets = data;
	    });
	}

    /**
     * Добавить цель
     */
    $scope.addTarget = function() {
    	var uuid = uuid4.generate();
    	//console.log("addTarget uuid: ", uuid);

    	var data = [[1, false, "task/addtask", {"id": uuid, "taskName": 'new task ' + uuid}]];
		bufferService.send(data, function(data) {
	        console.log("selfsend: ", data);
	        //$scope.targets.push(data);
	        //$scope.targets = data;
	        getAllTarget();
	    });
	}

    /**
     * Добавить подцель
     */
    $scope.addSubTarget = function() {
    	var obj = _.find($scope.targets, function(obj) { return obj.selected == true });
    	console.log("addSubTarget for: ", obj.id);
    }

    /**
     * Удалить цель
     */
    $scope.deleteTarget = function() {
    	var obj = _.find($scope.targets, function(obj) { return obj.selected == true });
    	console.log("obj: ", obj);
    	//$scope.targets;
	    //var id = '123';
	    console.log("deleteGoal:", obj.id);
	    var deleteGoal = [[1, false, "task/deletetask", {"id": obj.id}]];
		bufferService.send(deleteGoal, function(data) {
	        //console.log("selfsend: ", data);
	        //$scope.targets = data;
	        getAllTarget();
	    });
	}

	/**
	 * Старт
	 */
	function init() {
		getAllTarget();
	}
	init();

}]);