/**
 * Created by SNKraynov on 03.03.2016.
 */
angular.module('bitaskApp.editors.taskEditor', [
        'bitaskApp.service.task',
        'bitaskApp.service.date'
    ])
    .controller('taskEditor',['$scope', 'taskService', '$mdDialog', 'locals', '$interval', '$auth', 'uuid4', 'keyboardService',
        function ($scope, taskService, $mdDialog, locals, $interval, $auth, uuid4, keyboardService){

            $scope.task = {
                taskName:'',
                performer:'',
                taskDescription:'',
                parentId: ''
            };
            locals.onClose = function (){
                keyboardService.off();
                $scope.save();
            };
            $scope.save = function (){

                if($scope.task.parentId == '')
                    $scope.task.parentId = taskService.new_task.id;
                else if($scope.task.parentId == 'null')
                    $scope.task.parentId = null;


                if($scope.task.taskName == '')
                {
                    $scope.close();
                    return;
                }

                var task = {

                    "id":uuid4.generate(),
                    "taskName": $scope.task.taskName,
                    "taskDescription": $scope.task.taskDescription,
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

                    "author": $auth.getPayload().email,
                    "performer": $auth.getPayload().email,

                    "shared":0,
                    "directionBranch": "right",
                    "viewBranch":"hide",
                    "status":"delivered",
                    "completeTime": 0,
                    "reminder": 0,
                    "changed": 0,
                    "mapIndex": 0,
                    "parentId": $scope.task.parentId,
                    "role":19,  // 17 - автор, 18 - сполнитель, 19 - и то и то
                    "actions":"227"
                };

                taskService.createTask(task);


                $scope.close();
            };
            $scope.close = function (){
                $mdDialog.hide();
            };

            var __constructor = function (){
                $scope.show_completebox = (locals.mode == "edit_task");
                switch (locals.mode){
                    case 'sub_task':
                    case 'brother_task':
                        $scope.form_name = "Создать задачу";
                        break;
                    case 'edit_task':
                        $scope.form_name = "Редактировать задачу";
                        break;
                }

                keyboardService.on(function (){
                    console.log('taskEditor - keypress');
                });
            };
            __constructor();
        }
    ]);