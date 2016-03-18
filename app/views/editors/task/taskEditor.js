/**
 * Created by SNKraynov on 03.03.2016.
 */
angular.module('bitaskApp.editors.taskEditor', [
        'bitaskApp.service.task',
        'bitaskApp.service.date'
    ])
    .controller('taskEditor',['$scope', 'taskService', '$mdDialog', 'locals', '$interval', '$auth', 'uuid4', 'keyboardService',
        function ($scope, taskService, $mdDialog, locals, $interval, $auth, uuid4, keyboardService){

            var task = {};

            $scope.task = {
                taskName:'',
                performer:'',
                taskDescription:'',
                parentId: '',
                status:''
            };

            // Показать чекбокс завершения только при редактировании
            $scope.show_completebox = (locals.mode == "edit_task");

            locals.onClose = function (){
                keyboardService.off();
            }

            /**
             * Кнопка сохранить (ОК)
             */
            $scope.save = function (){

                var param;

                if($scope.task.parentId == '')
                    $scope.task.parentId = null;


                // Если поле имя и описание не заполнены, просто закрываем и выходим
                if($scope.task.taskName == '' && $scope.task.taskDescription == '')
                {
                    $scope.close();
                    return;
                }

                if($scope.task.taskName == '' && $scope.task.taskDescription != '')
                {
                    $scope.task.taskName = $scope.task.taskDescription;
                }


                if(locals.mode == 'edit_task')
                {
                    var new_params = {};
                    for(param in $scope.task)
                    {
                        if($scope.task[param] != task[param])
                            new_params[param] = $scope.task[param];
                    }
                    taskService.editTask(task.id, new_params);
                }
                else
                {
                    for(param in $scope.task)
                    {
                        task[param] = $scope.task[param];
                    }
                    taskService.createTask(task);
                }

                $scope.close();
            };

            /**
             * Кнопка закрыть (Х)
             */
            $scope.close = function (){


                $mdDialog.hide();
            };

            /**
             * Кнопка - удалить задачу
             */
            $scope.delete = function (){
                taskService.showDeleteTaskDialog(task.id);
            };

            /**
             * Обработчик смены статуса (чекбокса)
             */
            $scope.setStatus = function (){
                if($scope.task.status == 'completed')
                    $scope.task.status = 'delivered';
                else if($scope.task.status == 'delivered')
                    $scope.task.status = 'completed';
            }

            /**
             * Обработчик клавиш
             */
            keyboardService.on(null, function (event){

                switch (event.keyCode){
                    case 27:        // Esc
                    {
                        $scope.close();
                        break;
                    }
                }

                if(event.ctrlKey && event.keyCode == 13 || event.keyCode == 10)
                {
                    $scope.save();
                }
            });

            /**
             * Получить задачу с которой работаем.
             *
             * Создает новый или получает существующий объект.
             */
            var getTask = function (){

                var task;
                if(locals.mode == 'edit_task')
                    task = taskService.tasks_indexed[locals.taskId];
                else
                    task = {
                        "id":uuid4.generate(),
                        "taskName": "",
                        "taskDescription": "",
                        "createTime":1442895357,

                        "timeBeginAuthor": null,
                        "timeEndAuhor": null,
                        "dateBeginAuthor": null,
                        "dateEndAuthor": null,

                        "timeBeginPerformer": null,
                        "timeEndPerformer": null,
                        "dateBeginPerformer": null,
                        "dateEndPerformer": null,

                        "regularSetting":null,

                        "author": null,
                        "performer": null,

                        "shared":0,
                        "directionBranch": "right",
                        "viewBranch":"hide",
                        "status":"delivered",
                        "completeTime": 0,
                        "reminder": 0,
                        "changed": 0,
                        "mapIndex": 0,
                        "parentId": null,
                        "role":19,  // 17 - автор, 18 - сполнитель, 19 - и то и то
                        "actions":"227"
                    }

                // Определяем родителя
                switch (locals.mode){
                    case 'new_task':
                        task.parentId = taskService.new_task.id
                        break;
                    case 'sub_task':
                        task.parentId = locals.taskId;
                        break;
                    case 'brother_task':
                        task.parentId = taskService.tasks_indexed[locals.taskId].parentId;
                        break;
                    case 'edit_task':
                        break;
                    default:
                        break;
                }

                return task;
            };

            /**
             * Заполняем поля формы
             */
            var fillField = function (){

                $scope.task.taskName = task.taskName;
                $scope.task.performer = task.performer;
                $scope.task.taskDescription = task.taskDescription;
                $scope.task.parentId = task.parentId;
                $scope.task.status = task.status;

            };

            /**
             * Конструктор
             * @private
             */
            var __constructor = function (){

                // Получить задачу с которой работаем
                task = getTask();

                // Заполняем поля формы
                fillField();
            };
            __constructor();
        }
    ]);