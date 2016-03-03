/**
 * Created by SNKraynov on 03.03.2016.
 */
angular.module('bitaskApp.editors.taskEditor', [
        'bitaskApp.service.task',
        'bitaskApp.service.date'
    ])
    .controller('taskEditor',['$scope', '$mdDialog', 'locals', function ($scope, $mdDialog, locals){

        $scope.close = function (){
            $mdDialog.hide();
        }

        locals.onClose = function (){
            debugger;
        }


    }])
