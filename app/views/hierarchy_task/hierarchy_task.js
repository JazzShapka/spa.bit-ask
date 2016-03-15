/**
 * Created by SNKraynov on 19.02.2016.
 */
'use strict';

angular.module('bitaskApp.hierarchy_task', [
    'ngRoute',
    'bitaskApp.service.task',
    'bitaskApp.service.date',
    'bitaskApp.service.keyboard',
    'bitaskApp.service.user'
])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/hierarchy_task', {
            templateUrl: './app/views/hierarchy_task/hierarchy_task.html',
            controller: 'HierarchyTaskCtrl'
        });
    }])
    .controller('HierarchyTaskCtrl', ['$scope', '$log', 'taskService', 'dateService', '$document', 'keyboardService',
        'userService', '$timeout',
        function($scope, $log, taskService, dateService, $document, keyboardService, userService, $timeout) {

            var selected_element = false,   // Выбранный элемент (с классом task_background)
                selected_id = false;        // id выбранного элемента

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
            $scope.comleteTask = function (taskId, $event){
                $event.stopPropagation();

                if(taskService.tasks_indexed[taskId].status == 'delivered')
                    taskService.tasks_indexed[taskId].status = 'completed';

                else if(taskService.tasks_indexed[taskId].status == 'completed')
                    taskService.tasks_indexed[taskId].status = 'delivered';

                taskService.setTask(taskId, {status:taskService.tasks_indexed[taskId].status});
            };

            /**
             * Кнопка - развернуть задачу
             * @param taskId - id задачи
             * @param action - Открыть или закрыть ('hide' || 'show'), если
             * не передать то изменится на противоположное
             */
            $scope.expandTask = function (taskId, action){
                var task = taskService.tasks_indexed[taskId];

                // Если задано, открыть или закрыть
                if(action)
                {
                    if(action == 'hide')
                        task.viewBranch = 'hide';
                    else

                    {
                        task.viewBranch = 'show';
                        // Загружаем наперед
                        taskService.loadingAdvance();
                    }
                    taskService.setTask(taskId, {viewBranch:task.viewBranch});
                }
                // Если не задано то просто меняем на противоположное
                else
                {
                    if(task.viewBranch == 'show')
                        task.viewBranch = 'hide';
                    else
                    {
                        task.viewBranch = 'show';
                        // Загружаем наперед
                        taskService.loadingAdvance();
                    }

                    taskService.setTask(taskId, {viewBranch:task.viewBranch});
                }


            };

            $scope.selectTask = function (taskId){
                var task_elem = angular.element('.hierarchy_task_background').find('[data-id = "'+ taskId +'"]');
                if(task_elem.length)
                {
                    if(selected_element)
                        selected_element.removeClass('selected');

                    selected_element = task_elem.parent().addClass('selected');
                    selected_id = taskId;

                    userService.setValue('selected_task', selected_id);
                }
            };

            $scope.onRenderTask = function (){
                userService.getValue('selected_task', function (response){
                    if(response.value)
                    {
                        var task_elem = angular.element('.hierarchy_task_background').find('[data-id = "'+ response.value +'"]');
                        if(task_elem.length)
                        {
                            selected_element = task_elem.parent().addClass('selected');
                            selected_id = response.value;
                        }
                    }
                })
            }


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

            /**
             * Обработка нажатий клавиш
             */
            keyboardService.on(null, function (event){

                var task_elem, self_task, old_selected_id = selected_id;

                // Если нажаты клавиши стрелок, а элемент еще не выбран
                if(!selected_element && event.keyCode >= 37 && event.keyCode <= 40)
                {
                    task_elem = angular.element('.hierarchy_task_background').find('.task:first');
                    selected_id = task_elem.data('id');
                    selected_element = task_elem.parent().addClass('selected');

                    return;
                }


                switch (event.keyCode)
                {
                    case 38:    // up
                    {
                        var prev_element = selected_element.prev ();
                        if (prev_element.length)
                        {
                            selected_element.removeClass ('selected');
                            selected_element = prev_element;
                            selected_element.addClass ('selected');
                            selected_id = selected_element.find ('.task:first').data ('id');
                        }

                        break;
                    }
                    case 40:    // down
                    {
                        var next_element = selected_element.next ();
                        if (next_element.length)
                        {
                            selected_element.removeClass ('selected');
                            selected_element = next_element;
                            selected_element.addClass ('selected');
                            selected_id = selected_element.find ('.task:first').data ('id');
                        }
                        break;
                    }
                    case 37:    // left
                    {
                        self_task = taskService.tasks_indexed[selected_id];

                        if(self_task.children && self_task.viewBranch == 'show')
                        {
                            $scope.expandTask(self_task.id, 'hide');
                            $scope.$apply();
                        }
                        else
                        {
                            var new_selected_element = selected_element.parent().parent();
                            if(new_selected_element.hasClass('task_background'))
                            {
                                selected_element.removeClass('selected');
                                task_elem = new_selected_element.find('.task');

                                selected_id = task_elem.data('id');
                                selected_element = new_selected_element.addClass('selected');
                            }
                        }

                        break;
                    }
                    case 39:    // right
                    {
                        self_task = taskService.tasks_indexed[selected_id];
                        if(self_task.children)
                        {
                            if(self_task.viewBranch == 'hide')
                            {
                                $scope.expandTask(self_task.id, 'show');
                                $scope.$apply();
                            }
                            else
                            {
                                // Ищем первый дочерний элемент
                                task_elem = selected_element.find('.children:first').find('.task:first');
                                if(task_elem.length > 0)
                                {
                                    // Снимаем старое выделение
                                    selected_element.removeClass ('selected');

                                    selected_id = task_elem.data('id');
                                    selected_element = task_elem.parent().addClass('selected');
                                }
                            }
                        }
                        break;
                    }
                    case 13:    // enter

                        break;
                    case 32:    // space

                        break;
                    case 9:     // tab

                        break;
                }

                // Если изменится id выбранной задачи, то зохраняем на сервере
                if(old_selected_id != selected_id)
                {
                    userService.setValue('selected_task', selected_id);
                }

            });

            var __construct = function (){

            }
            __construct();
    }]);