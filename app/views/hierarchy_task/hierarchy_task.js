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
    .controller('HierarchyTaskCtrl', function($scope, $log, tasksService, $document) {

        $scope.tasks = tasksService.tasks;

        /**
         * Центровка холста.
         *
         * После сдвига холста проверяем его центровку и сдвигаем в
         * нужную сторону, если нужно.
         */
        $scope.dropCanvas = function (){

            var canvas = $(this);
            var window = $($document);
            var canvas_width = canvas.innerWidth();
            var canvas_height = canvas.innerHeight();
            var window_width = window.width();
            var window_height = window.height();

            var canvas_pos = canvas.offset();
            canvas_pos.bottom = window_height - (canvas_height + canvas_pos.top);
            canvas_pos.right = window_width - (canvas_width + canvas_pos.left);

            if(canvas_pos.left > 0 && canvas_pos.top > 0 && canvas_pos.right < 0 && canvas_pos.bottom < 0)
                canvas.animate({left:0, top:0}, 200);
            else if(canvas_pos.left > 0 && canvas_pos.top < 0 && canvas_pos.right < 0 && canvas_pos.bottom < 0)
                canvas.animate({left:0}, 200);
            else if(canvas_pos.left < 0 && canvas_pos.top > 0 && canvas_pos.right < 0 && canvas_pos.bottom < 0)
                canvas.animate({top:0}, 200);
            else if(canvas_pos.left > 0 && canvas_pos.top < 0 && canvas_pos.right < 0 && canvas_pos.bottom > 0)
                canvas.animate({left:0, top:-(canvas_height-window_height)}, 200);
            else if(canvas_pos.left < 0 && canvas_pos.top < 0 && canvas_pos.right < 0 && canvas_pos.bottom > 0)
                canvas.animate({top:-(canvas_height-window_height)}, 200);
            else if(canvas_pos.left < 0 && canvas_pos.top < 0 && canvas_pos.right > 0 && canvas_pos.bottom > 0)
                canvas.animate({left:-(canvas_width-window_width) ,top:-(canvas_height-window_height)}, 200);
            else if(canvas_pos.left < 0 && canvas_pos.top < 0 && canvas_pos.right > 0 && canvas_pos.bottom < 0)
                canvas.animate({left:-(canvas_width-window_width)}, 200);
            else if(canvas_pos.left < 0 && canvas_pos.top > 0 && canvas_pos.right > 0 && canvas_pos.bottom < 0)
                canvas.animate({left:-(canvas_width-window_width), top: 0}, 200);
        };

        $scope.$watch(function () {
                return tasksService.tasks;
            },
            tasksService.refreshChildren,
            true
        );
    });