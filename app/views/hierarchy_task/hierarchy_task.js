/**
 * Created by SNKraynov on 19.02.2016.
 */
'use strict';

angular.module('bitaskApp.hierarchy_task', [
    'ngRoute',
    'bitaskApp.service.task',
    'bitaskApp.service.date'
])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/hierarchy_task', {
            templateUrl: './app/views/hierarchy_task/hierarchy_task.html',
            controller: 'HierarchyTaskCtrl'
        });
    }])
    .controller('HierarchyTaskCtrl', function($scope, $log, tasksService, dateService, $document, $auth) {

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

        /**
         * Отслеживать изменение в задачах.
         * Обновляет счетчик детей задачи
         */
        $scope.$watch(function () {
                return tasksService.tasks;
            }, tasksService.refreshChildren, true);

        $scope.comleteTask = function (taskId){
            if(tasksService.tasks_indexed[taskId].status == 'delivered')
                tasksService.tasks_indexed[taskId].status = 'completed';
            else if(tasksService.tasks_indexed[taskId].status == 'completed')
                tasksService.tasks_indexed[taskId].status = 'delivered';

        };

        /**
         * Регулярная задача или нет
         * @param taskId
         * @returns {boolean}
         */
        $scope.isRegular = function (taskId){
            try
            {
                var regularityData = JSON.parse(tasksService.tasks_indexed[taskId].regularSetting);
                return regularityData.SelectedSetting != 'none';
            }
            catch(e){
                return false;
            }
        };
        /**
         * Получить класс иконки расшаривания
         * @param taskId
         * @returns {*}
         */
        $scope.getShareClass = function (taskId){

            if(tasksService.tasks_indexed[taskId].shared)
                return 'blue';
            else
                return 'gray';

        };
        /**
         * Получить класс иконки пользователя
         * @param taskId
         * @returns {*}
         */
        $scope.getUserClass = function (taskId){

            // Автор, не исполнитель.
            if($scope.isAuthor(taskId) && !$scope.isPerformer(taskId))
            {
                return 'blue';
            }
            // Исполнитель, не автор.
            else if(!$scope.isAuthor(taskId) && $scope.isPerformer(taskId))
            {
                return 'red';
            }
            // И автор, и исполнитель.
            else
            {
                return 'gray none';
            }
        };
        /**
         * Получить имя пользователя - контакта
         * @param taskId
         * @returns {*}
         */
        $scope.getUserName = function (taskId){


            // Автор, не исполнитель.
            if($scope.isAuthor(taskId) && !$scope.isPerformer(taskId))
            {
                return 'Исполнитель: ' + tasksService.tasks_indexed[taskId].performer;
            }
            // Исполнитель, не автор.
            else if(!$scope.isAuthor(taskId) && $scope.isPerformer(taskId))
            {
                return 'От: ' + tasksService.tasks_indexed[taskId].author;
            }
            // И автор, и исполнитель.
            else
            {
                return 'Выбрать исполнителя';
            }
        };
        /**
         * Получить класс календаря
         * @param taskId
         */
        $scope.getDateClass = function (taskId){

        };

        $scope.getDate = function (timestamp, format){
            if(format === undefined)
                format = 'dd.MM.yyyy';

            return new Date(timestamp * 1000).toString(format);
        };


        /**
         * Вернет срок задачи для текущего пользователя
         * @param taskId
         * @returns {*}
         */
        $scope.userTimeLimit = function (taskId){
            if(tasksService.tasks_indexed.hasOwnProperty(taskId))
            {
                if($scope.isAuthor(taskId))
                    return tasksService.tasks_indexed[taskId].timeLimitAuthor;
                else
                    return tasksService.tasks_indexed[taskId].timeLimit;
            }
            else
            {
                return null;
            }
        };

        /**
         * Является ли пользователь автором задачи.
         * @param taskId
         * @returns {boolean}
         */
        $scope.isAuthor = function (taskId){
            if(tasksService.tasks_indexed.hasOwnProperty(taskId))
                return (tasksService.tasks_indexed[taskId].role & CONST.ROLE_AUTHOR) != 0;
            else
                return false;
        };

        /**
         * Является ли пользователь исполнителем
         * @param taskId
         * @returns {boolean}
         */
        $scope.isPerformer = function (taskId){
            if(tasksService.tasks_indexed.hasOwnProperty(taskId))
                return (tasksService.tasks_indexed[taskId].role & CONST.ROLE_PERFORMER) != 0;
            else
                return false;
        };


        var asd = $auth.getPayload();
        //debugger;
    });