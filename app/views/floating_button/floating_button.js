/**
 * Created by SNKraynov on 16.02.2016.
 */
'use strict';

angular.module('bitaskApp.floating_button', [])
    .controller('FloatingButtonCtrl', ['$scope', 'taskService', function ($scope, taskService, $mdDialog){

        $scope.addTask = function (){
            taskService.showTaskEditor('new_task');
        }

    }]);