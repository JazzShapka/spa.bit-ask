/**
 * Created by SNKraynov on 03.03.2016.
 */
angular.module('bitaskApp.editors.taskEditor', [
        'bitaskApp.service.task',
        'bitaskApp.service.date'
    ])
    .controller('taskEditor',['$scope', 'taskService', '$mdDialog', 'locals', '$interval', function ($scope, taskService, $mdDialog, locals, $interval){

        $scope.task = {
            taskName:'',
            performer:'',
            taskDescription:''
        };

        $scope.close = function (){




            $mdDialog.hide();
        };

        locals.onClose = function (){
            $scope.close();
        };

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
    }]);