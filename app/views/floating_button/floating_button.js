/**
 * Created by SNKraynov on 16.02.2016.
 */
'use strict';

angular.module('bitaskApp.floating_button', [])
    .controller('FloatingButtonCtrl', ['$scope', 'taskService', 'goalService', function ($scope, taskService, goalService){

        $scope.addTask = function (){
            taskService.showTaskEditor('new_task');
        };
        $scope.addGoal = function (){
            goalService.showGoalEditor('new_goal');
        };

    }]);