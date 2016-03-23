'use strict';

angular.module('bitaskApp.goals', ['ngRoute', 'ngMaterial', 'underscore', 'ivh.treeview'])

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
    	/*$mdDialog.show(
      		$mdDialog.alert()
		        .title('Secondary Action')
		        .textContent('Secondary actions can be used for one click actions')
		        .ariaLabel('Secondary click demo')
		        .ok('Neat!')
		        .targetEvent(event)
	    );*/
	    console.log("doSecondaryAction");
	    getSubTarget();
  	};

  	/**
  	 * del
  	 */
	/*$scope.$watchCollection('targets', function(newValue, oldValue) {
		console.log("watch1: ", newValue);
	    $scope.dataCount = newValue.length;
	});

	$scope.$watch('targets', function(newValue, oldValue) {
		console.log("watch2 ");
	  	$scope.counter = scope.counter + 1;
	});*/

	/**
	 * Загружаем все цели
	 */
	$scope.getAllTarget = function() {
		//var alldata = '[[1,false,"task/subtasks",{"parentId":"0"}]]';
		var alldata = '[[1,false,"target/list",{"parentId":"0"}]]';
		bufferService.send(alldata, function(data) {
	        //console.log("selfsend: ", data);
	        $scope.targets = data;

	        console.log("data: ", data);
	        
	        //var obj = _.find($scope.targets, function(obj) { return obj.children == 0 });
	        
	        //console.log("objChildren: ", obj);
	        //console.log("data0.children: ", data[0].children);
	        //if () {

	        //}
	        //this.goals = data ;
	    });
	}

	/**
	 * Загружаем под цели
	 */
	function getSubTarget() {
		
		var obj = _.find($scope.targets, function(obj) { return obj.selected == true });
		var parentId = obj.id;
		
		console.log("parentId: ", parentId);
		
		var alldata = [[1,false,"task/subtasks",{"parentId":parentId}]];
		bufferService.send(alldata, function(data) {
	        //console.log("selfsend: ", data);
	        $scope.targets = data;
	        console.log("data: ", data);
	    });
	}


    /**
     * Добавить цель
     */
    $scope.addTarget = function() {
    	var uuid = uuid4.generate();
    	//console.log("addTarget uuid: ", uuid);

    	//var data = [[1, false, "task/addtask", {"id": uuid, "taskName": 'new task ' + uuid}]];
    	var data = [[1, false, "target/create", {"id": uuid, "description":"des"}]];
		bufferService.send(data, function(data) {
	        console.log("selfsend: ", data);
	        //$scope.targets.push(data);
	        //$scope.targets = data;
	        $scope.getAllTarget();
	    });
	}

    /**
     * Добавить подцель
     */
    $scope.addSubTarget = function() {
    	var uuid = uuid4.generate();
    	var obj = _.find($scope.targets, function(obj) { return obj.selected == true });
    	console.log("addSubTarget for: ", obj.id);

    	var data = [[1, false, "target/create", { "id": uuid, "description":"subdes", parentId:obj.id }]];
		bufferService.send(data, function(data) {
	        console.log("selfsend: ", data);
	        //$scope.targets.push(data);
	        //$scope.targets = data;
	        $scope.getAllTarget();
	    });

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
	    //var deleteGoal = [[1, false, "task/deletetask", {"id": obj.id}]];
	    var deleteGoal = [[1, false, "target/delete", {"id": obj.id}]];
		bufferService.send(deleteGoal, function(data) {
	        //console.log("selfsend: ", data);
	        //$scope.targets = data;
	        $scope.getAllTarget();
	    });
	}

	/**
	 * Чекбокс вкл/выкл
	 */
	$scope.change = function() {
		console.log("change");
		//getSubTarget();
	}

	//$scope.targets;

	this.goals = [{
	      label: 'Glasses',
	      value: 'glasses',
	      children: [{
	        label: 'Top Hat',
	        value: 'top_hat'
	      },{
	        label: 'Curly Mustache',
	        value: 'mustachio'
	      }]
	}];

	this.awesomeCallback = function(node, tree) {
	    // Do something with node or tree
	};

	this.otherAwesomeCallback = function(node, isSelected, tree) {
	    // Do soemthing with node or tree based on isSelected
	}


	/**
	 * Старт
	 */
	function init() {
		$scope.getAllTarget();
	}
	init();

}]);