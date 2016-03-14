/**
 * Created by SNKraynov on 19.02.2016.
 */
'use strict';

angular.module('bitaskApp.hierarchy_task', [
    'ngRoute',
    'bitaskApp.service.task',
    'bitaskApp.service.date',
    'bitaskApp.service.keyboard'
])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/hierarchy_task', {
            templateUrl: './app/views/hierarchy_task/hierarchy_task.html',
            controller: 'HierarchyTaskCtrl'
        });
    }])
    .controller('HierarchyTaskCtrl', ['$scope', '$log', 'taskService', 'dateService', '$document', 'keyboardService',
        function($scope, $log, taskService, dateService, $document, keyboardService) {

            $scope.tasks = taskService.tasks;

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
                    return taskService.tasks;
                }, taskService.refreshChildren, true);

            /**
             * Галочка - выполнить задачу.
             * @param taskId
             */
            $scope.comleteTask = function (taskId){
                if(taskService.tasks_indexed[taskId].status == 'delivered')
                    taskService.tasks_indexed[taskId].status = 'completed';
                else if(taskService.tasks_indexed[taskId].status == 'completed')
                    taskService.tasks_indexed[taskId].status = 'delivered';

                taskService.setTask(taskId, {status:taskService.tasks_indexed[taskId].status});

            };

            /**
             * Кнопка - развернуть задачу
             * @param taskId
             */
            $scope.expandTask = function (taskId){
                var task = taskService.tasks_indexed[taskId];

                if(task.viewBranch == 'show')
                    task.viewBranch = 'hide';
                else
                {
                    task.viewBranch = 'show';
                    // Загружаем наперед
                    taskService.loadingAdvance();
                }

                taskService.setTask(taskId, {viewBranch:task.viewBranch});
            };


            /**
             * Регулярная задача или нет
             * @param taskId
             * @returns {boolean}
             */
            $scope.isRegular = function (taskId){
                try
                {
                    var regularityData = JSON.parse(taskService.tasks_indexed[taskId].regularSetting);
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

                if(taskService.tasks_indexed[taskId].shared)
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
                    return 'Исполнитель: ' + taskService.tasks_indexed[taskId].performer;
                }
                // Исполнитель, не автор.
                else if(!$scope.isAuthor(taskId) && $scope.isPerformer(taskId))
                {
                    return 'От: ' + taskService.tasks_indexed[taskId].author;
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
                var task = taskService.tasks_indexed[taskId];

                if(task.status == 'completed')
                    return 'gray';

                var time_limit = $scope.userTimeLimit(taskId);
                if(time_limit < dateService.dateServer)
                    return 'red';
                else if(time_limit == 0)
                    return "gray";
                else
                    return "blue";
            };
            /**
             * Определяет, показывать календарь или нет.
             * @param taskId
             * @returns {boolean}
             */
            $scope.isShowedDate = function (taskId){
                if(taskService.tasks_indexed[taskId].status == "delivered")
                {
                    return $scope.userTimeLimit(taskId) > 0;
                }
                else
                {
                    return false;
                }
            };
            /**
             * Получить title к дате
             * @param taskId
             * @returns {*}
             */
            $scope.getDateString = function (taskId){
                if(taskService.tasks_indexed[taskId].status == "delivered")
                    return new Date($scope.userTimeLimit(taskId) * 1000).toString('dd.MM.yyyy');
                else if(taskService.tasks_indexed[taskId].status == "completed")
                    return "Выполнено: " + new Date(taskService.tasks_indexed[taskId].completeTime * 1000).toString('dd.MM.yyyy');

            };
            /**
             * Возвращает класс для кнопки открытия
             * @param taskId
             */
            $scope.getExpandBoxClass = function (taskId){
                var task = taskService.tasks_indexed[taskId];
                var string_class = '';

                if(task.viewBranch == 'show')
                {
                    string_class += 'open';
                }
                else
                    string_class += 'close';

                string_class += ' ' + task.directionBranch;
                return string_class;
            };


            /**
             * Вернет срок задачи для текущего пользователя
             * @param taskId
             * @returns {*}
             */
            $scope.userTimeLimit = function (taskId){

                var task = taskService.tasks_indexed[taskId];

                if($scope.isAuthor(taskId))
                    return task.dateEndAuthor + (task.timeEndAuhor==null?0:task.timeEndAuhor);
                else
                    return task.dateEndPerformer + (task.timeEndPerformer==null?0:task.timeEndPerformer);

            };
            /**
             * Является ли пользователь автором задачи.
             * @param taskId
             * @returns {boolean}
             */
            $scope.isAuthor = function (taskId){
                if(taskService.tasks_indexed.hasOwnProperty(taskId))
                    return (taskService.tasks_indexed[taskId].role & CONST.ROLE_AUTHOR) != 0;
                else
                    return false;
            };
            /**
             * Является ли пользователь исполнителем
             * @param taskId
             * @returns {boolean}
             */
            $scope.isPerformer = function (taskId){
                if(taskService.tasks_indexed.hasOwnProperty(taskId))
                    return (taskService.tasks_indexed[taskId].role & CONST.ROLE_PERFORMER) != 0;
                else
                    return false;
            };
            /**
             * Получить читаемую строку регулярности.
             * @param setting
             * @returns {*}
             */
            $scope.getRegularityString = function (setting){
                var regulationCaptionsDefault = [
                    ['none', "Не установлено"],
                    ['everyDay', "Каждый день"],
                    ['everyWeek', "Каждую неделю"],
                    ['everyMounth', "Каждый месяц"],
                    ['everyYear', "Каждый год"],
                    ['custom', "Настроить..."]
                ];

                try {
                    var regularityData = JSON.parse(setting);
                }
                catch(e)
                {
                    return "Не настроено";
                }

                var par, i, orderD, kindD;

                orderD = {'first':"первый",'second':"второй",'third':"третий",'fourth':"четвертый",'last':"последний"};
                kindD = {'Mon':"понедельник",'Tue':"вторник",'Wed':"среда",'Thu':"четверг",'Fri':"пятница",
                    'Sat':"суббота",'Sun':"воскресенье",'day':"день",'workday':"рабочий день",'weekend':"выходной"};

                if(regularityData.SelectedSetting == 'custom')
                {
                    if(regularityData.period == 'day')
                    {
                        return "ПОВТОР: Каждый " + regularityData.frequency + " день";
                    }
                    else if(regularityData.period == 'week')
                    {
                        var daysOfWeek = {'Mon':"Пн",'Tue':"Вт",'Wed':"Ср",'Thu':"Чт",'Fri':"Пт",'Sat':"Сб",'Sun':"Вс"};
                        par = [];
                        for(i=0; i<regularityData.parameter.length; i++)
                        {
                            par.push(daysOfWeek[regularityData.parameter[i]]);
                        }
                        return "ПОВТОР: Каждую " + regularityData.frequency + " неделю, по " + par;
                    }
                    else if(regularityData.period == 'mounth')
                    {
                        if(typeof(regularityData.parameter) == 'object')
                        {
                            return "ПОВТОР: Каждый " + regularityData.frequency + " месяц, " + regularityData.parameter + " числа";
                        }
                        else
                        {
                            return "ПОВТОР: Каждый " + regularityData.frequency + " месяц, каждый "
                                + orderD[regularityData.orderDay] + " " + kindD[regularityData.kindDay];
                        }
                    }
                    else if(regularityData.period == 'year')
                    {
                        var monthOfYear = {'jan':"январь",'feb':"февраль",'mar':"март",'apr':"апрель",
                            'may':"май",'jun':"июнь",'jul':"июль",'aug':"август",'sep':"сентябрь",
                            'oct':"октябрь",'nov':"ноябрь",'dec':"декабрь"};
                        par = [];
                        for(i=0;i<regularityData.parameter.length;i++)
                        {
                            par.push(monthOfYear[regularityData.parameter[i]]);
                        }

                        if(parseInt(regularityData.orderDay))
                        {
                            return "ПОВТОР: Каждый " + egularityData.frequency + " год, по " + par
                                + ", каждый " + regularityData.orderDay + " день";
                        }
                        else
                        {
                            return "ПОВТОР: Каждый " + regularityData.frequency + " год, по " + par
                                + "каждый " + orderD[regularityData.orderDay] + " " + kindD[regularityData.kindDay];

                        }
                    }
                }
                for(i=0;i<regulationCaptionsDefault.length;i++)
                {
                    if(regulationCaptionsDefault[i][0] == regularityData.SelectedSetting)
                    {
                        return "ПОВТОР: " + regulationCaptionsDefault[i][1];
                    }
                }
                return "Не настроено";
            };


            keyboardService.on(function (){
                console.log('hierarchy_task - keypress');
            });
    }]);