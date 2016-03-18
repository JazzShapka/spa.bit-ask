/**
 * Created by SNKraynov on 19.02.2016.
 */
angular.module('bitaskApp.service.task', [
    'bitaskApp.editors.taskEditor',
    'bitaskApp.service.buffer',
    'uuid4'
])
    .service('taskService', ['$timeout', '$mdDialog', 'bufferService', 'uuid4', 'keyboardService',
        function ($timeout, $mdDialog, bufferService, uuid4, keyboardService)
        {

            var self = this;

            self.new_task = {};             // Папка новые задачи
            self.tasks = [];                // Массив задач
            self.tasks_indexed = {};        // Проиндексированные задачи


            /**
             * Открыть редактор задачи.
             * @param mode - 'new_task' || 'sub_task' || 'brother_task' || 'edit_task'
             * @param taskId - id задачи в контексте которой вызываем окно
             *
             *  ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ:
             *
             * 1) Создание новой задачи
             *      taskService.showTaskEditor('new_task');
             *      Создастся задача в папке новые задачи, тоесть в поле parentId записывается
             *      id папки "Новые задачи"
             *
             * 2) Создание задачи на том же уровне
             *      taskService.showTaskEditor('brother_task', "13cb2b00-c37c-f52a-1f2a-59b934a4c2b8");
             *      Вторым параметром передаем id задачи на чьем уровне должна создаться подзадача.
             *
             * 3) Создание подзадачи
             *      taskService.showTaskEditor('sub_task', "13cb2b00-c37c-f52a-1f2a-59b934a4c2b8");
             *      Вторым параметром передаем id родительской задачи.
             *
             * 4) Редактирование задачи.
             *      taskService.showTaskEditor('sub_task', "13cb2b00-c37c-f52a-1f2a-59b934a4c2b8");
             *      Вторым параметром передаем id задачи которую хотим отредактировать.
             *
             *      -- Как то так...
             */
            self.showTaskEditor = function (mode, taskId){

                var locals = {
                    mode:mode,
                    taskId:taskId
                }

                $mdDialog.show({
                    controller: 'taskEditor',
                    templateUrl: 'app/views/editors/task/taskEditor.html',
                    onRemoving: function (){
                        locals.onClose();
                    },
                    locals : locals,
                    escapeToClose: false,
                    clickOutsideToClose:false
                });
            };
            /**
             * Открыть диалог удаления задачи
             */
            self.showDeleteTaskDialog = function (taskId){
                keyboardService.on();

                var task = self.tasks_indexed[taskId];

                var confirm = $mdDialog.confirm()
                    .title('Удаление задачи')
                    .textContent(empty(task.regularSetting)?'Вы собираетесь удалить задачу':'Удалить все будущие повторения?')
                    .ariaLabel('Delete task')
                    .ok('Удалить')
                    .cancel('Отмена');
                $mdDialog.show(confirm).then(function() {

                    self.deleteTask(task.id)

                    bufferService.send([[ uuid4.generate(), true, "task/deletetask", {id: task.id} ]]);

                    keyboardService.off();
                }, function() {
                    keyboardService.off();
                });
            }


            /**
             * Отправить запрос на создание задачи
             *
             * @param task
             */
            self.createTask = function (task){

                // Добавляем задачу в массив
                self.addTaskOnView(task);

                // Отправляем новую задачу на сервер
                bufferService.send([[ uuid4.generate(), true, "task/addtask", task ]]);
            };
            /**
             * Отправить запрос на изменение задачи
             *
             * @param taskId - id задачи
             * @param params - новые параметры
             */
            self.editTask = function (taskId, params){

                self.editTaskOnView(taskId, params);

                params.id = taskId;
                bufferService.send([[uuid4.generate(), true, "task/settask", params]]);
            };
            /**
             * Добавить задачу в массив отображающихся задач
             * @param task
             */
            self.addTaskOnView = function (task){
                if(self.tasks_indexed.hasOwnProperty(task.id))
                {

                }
                else
                {
                    self.tasks.push(task);

                    // Логирование
                    //console.groupCollapsed(task.taskName);
                    //console.log(task.taskName + ' ' + task.id);
                    //console.groupEnd();
                }

            };
            /**
             * Обновить параметры у задачи в массиве задач
             *
             * @param taskId
             * @param params
             */
            self.editTaskOnView = function (taskId, params){

                for(var param in params)
                {
                    self.tasks_indexed[taskId][param] = params[param];
                }
            }
            /**
             * Удалить задачу из хранилища
             * @param taskId
             */
            self.deleteTask = function (taskId){
                for(var i=0; i<self.tasks.length; i++)
                {
                    if(self.tasks[i].id == taskId)
                        self.tasks.splice(i, 1);
                }

                delete self.tasks_indexed[taskId];
            };


            /**
             * Обновить количество загруженых подзадач
             */
            self.refreshChildren = function (){

                for(var i=0; i<self.tasks.length; i++)
                {
                    // индексируем задачи
                    self.tasks_indexed[self.tasks[i].id] = self.tasks[i];

                    self.tasks[i].children_quantity = 0;
                    for(var j=0; j<self.tasks.length; j++)
                    {
                        if(self.tasks[i].id == self.tasks[j].parentId)
                        {
                            self.tasks[i].children_quantity++;
                        }
                    }
                }
            };
            /**
             * Получить подзадачи.
             * @param taskIds - массив id родителей || строка с id
             */
            self.getChildren = function (taskIds){

                // Если пришла строка, добавляем ее в массив
                if(typeof taskIds == 'string')
                    taskIds = [taskIds];

                var request = [];

                // Добавляем в запрос только задачи где количество
                // подзадач не равно реальному количеству задач.
                for(var i=0; i<taskIds.length; i++)
                {
                    var task = self.tasks_indexed[taskIds[i]];
                    if(task.children > 0 && task.children != task.children_quantity)
                    {
                        request.push([uuid4.generate(), false, "task/subtasks", {parentId:task.id}]);
                    }
                }

                // Отправляем запрос
                if(request.length)
                {
                    bufferService.send(request, function(data){

                        for(var i=0; i<data.length; i++)
                        {
                            self.addTaskOnView(data[i])
                        }
                    });
                }
            };
            /**
             * Загрузка наперед еще не открытых задач
             */
            self.loadingAdvance = function (){

                var taskIds = [];
                for(i=0; i<self.tasks.length; i++)
                {
                    if(self.tasks[i].children > 0 && self.tasks[i].viewBranch == 'hide')
                    {
                        taskIds.push(self.tasks[i].id);
                    }
                }

                // Получаем детей загруженых задач (Загрузка на перед)
                self.getChildren(taskIds);
            };
            /**
             * Свернуть все задачи и отправить на сервер.
             */
            self.shrinkAllTasks = function (){
                for(var i=0; i<self.tasks.length; i++)
                {
                    self.tasks[i].viewBranch = 'hide';
                }

                bufferService.send([[uuid4.generate(), true, "task/shrinkalltask"]], function (data){


                });
            }

            /**
             * Конструктор
             * @private
             */
            var __constructor = function (){

                // Получаем все задачи
                bufferService.send([[uuid4.generate(), false, "task/openedtasks"]], function (data){

                    // Добавляем все задачи в массив отображения
                    for(var i=0; i<data.length; i++)
                    {
                        self.addTaskOnView(data[i]);
                        if(data[i].status == 'new_task')
                            self.new_task = data[i];

                    }
                    // Обновляем количество подзадач
                    self.refreshChildren();

                    // Загрузим наперед
                    self.loadingAdvance();
                })
            };
            __constructor();
        }
    ]);


var __tasks = [
    {
        "id":"13cb2b00-c37c-f52a-1f2a-59b934a4c2b8",
        "taskName":"Задача ололо",
        "taskDescription":"Описание задачи",
        "createTime":1442895357,

        "timeBeginAuthor": null,
        "timeEndAuhor": null,
        "dateBeginAuthor": 1456876800,
        "dateEndAuthor": 1456876800,

        "timeBeginPerformer": null,
        "timeEndPerformer": null,
        "dateBeginPerformer": 1456876800,
        "dateEndPerformer": 1456876800,

        "regularSetting":'{"SelectedSetting":"everyWeek"}',

        "author": "author@mail.ru",
        "performer": "performer@mail.ru",

        "shared":0,
        "directionBranch": "right",
        "viewBranch":"hide",
        "status":"delivered",
        "completeTime": 0,
        "reminder": 0,
        "changed": 0,
        "mapIndex":"0",
        "parentId":null,
        "role":18,  // 17 - автор, 18 - сполнитель, 19 - и то и то
        "actions":"227"
    }
];
