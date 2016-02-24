/**
 * Created by SNKraynov on 19.02.2016.
 */
'use strict';

angular.module('bitaskApp.hierarchy_task', ['ngRoute', 'bitaskApp.service.task'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/hierarchy_task', {
            templateUrl: './app/views/hierarchy_task/hierarchy_task.html',
            controller: 'HierarchyTaskCtrl'
        });
    }])
    .controller('HierarchyTaskCtrl', function($scope, $log, tasks) {

        $scope.start = function (){
            $log.debug('start');
        };

        $scope.stop = function (){
            $log.debug('stop');
        };
    });