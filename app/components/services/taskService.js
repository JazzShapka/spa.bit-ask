/**
 * Created by SNKraynov on 19.02.2016.
 */
angular.module('bitaskApp.service.task', ['bitaskApp.editors.taskEditor', 'uuid4'])
    .service('taskService', ['$timeout', '$mdDialog', 'bufferService', 'uuid4', function ($timeout, $mdDialog, bufferService, uuid4){

        var self = this;


        self.tasks = [];                // Массив задач

        self.tasks_indexed = {};        // Проиндексированные задачи



        /**
         * Открыть редактор задачи.
         * @param mode - 'sub_task' || 'brother_task' || 'edit_task'
         */
        self.showTaskEditor = function (mode){

            var locals = {
                mode:mode
            };
            $mdDialog.show({
                controller: 'taskEditor',
                templateUrl: 'app/views/editors/task/taskEditor.html',
                onRemoving: function (){
                    if(typeof locals.onClose == 'function')
                        locals.onClose();
                },
                locals : locals,
                clickOutsideToClose:true
            });
        };

        /**
         * Обновить количество подзадач
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

        self.getChildren = function (taskId){
            var task = self.tasks_indexed[taskId];
            if(task.children > 0 && task.children != task.children_quantity)
            {
                bufferService.send(function(data){

                    for(var i=0; i<data.length; i++)
                    {
                        var task = data[i];
                        self.tasks.push(task);
                    }
                }, taskId);
            }

        };

        var __constructor = function (){
            bufferService.send([uuid4.generate(), false, "task/openedtasks"], function (data){
                for(var i=0; i<data.length; i++)
                {
                    self.tasks.push(data[i]);
                }

            })
        };
        __constructor();
    }]);


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
    },
    {
        "id":"13cb2b00-c37c-f52a-1f2a-59b934a4c218",
        "taskName":"Задача qwe",
        "taskDescription":"Описание задачи",
        "createTime":1442895357,

        "timeBeginAuthor": null,
        "timeEndAuhor": null,
        "dateBeginAuthor": 1457136000,
        "dateEndAuthor": 1457222400,

        "timeBeginPerformer": null,
        "timeEndPerformer": null,
        "dateBeginPerformer": 1457136000,
        "dateEndPerformer": 1457222400,

        "regularSetting":'{"SelectedSetting":"everyWeek"}',

        "author": "author@mail.ru",
        "performer": "performer@mail.ru",

        "shared":0,
        "directionBranch": "right",
        "viewBranch":"hide",
        "status":"completed",
        "completeTime": 0,
        "reminder": 0,
        "changed": 0,
        "mapIndex":"0",
        "parentId":null,
        "role":17,  // 17 - автор, 18 - сполнитель, 19 - и то и то
        "actions":"227"
    },
    {
        "id":"13cb2b00-c37c-f52a-1f2a-59b934a4c228",
        "taskName":"Задача asdasd",
        "taskDescription":"Описание задачи",
        "createTime":1442895357,

        "timeBeginAuthor": null,
        "timeEndAuhor": null,
        "dateBeginAuthor": 1457136000,
        "dateEndAuthor": 1457222400,

        "timeBeginPerformer": null,
        "timeEndPerformer": null,
        "dateBeginPerformer": 1457136000,
        "dateEndPerformer": 1457222400,

        "regularSetting":'{"SelectedSetting":"everyWeek"}',

        "author": "author@mail.ru",
        "performer": "performer@mail.ru",

        "shared":1,
        "directionBranch": "right",
        "viewBranch":"hide",
        "status":"delivered",
        "completeTime": 0,
        "reminder": 0,
        "changed": 0,
        "mapIndex":"0",
        "parentId":"13cb2b00-c37c-f52a-1f2a-59b934a4c238",
        "role":17,  // 17 - автор, 18 - сполнитель, 19 - и то и то
        "actions":"227"
    },
    {
        "id":"13cb2b00-c37c-f52a-1f2a-59b934a4c238",
        "taskName":"Задача zxczxczxc",
        "taskDescription":"Описание задачи",
        "createTime":1442895357,

        "timeBeginAuthor": null,
        "timeEndAuhor": null,
        "dateBeginAuthor": 1457136000,
        "dateEndAuthor": 1457222400,

        "timeBeginPerformer": null,
        "timeEndPerformer": null,
        "dateBeginPerformer": 1457136000,
        "dateEndPerformer": 1457222400,

        "regularSetting":'{"SelectedSetting":"everyWeek"}',

        "author": "author@mail.ru",
        "performer": "performer@mail.ru",

        "shared":1,
        "directionBranch": "right",
        "viewBranch":"hide",
        "status":"delivered",
        "completeTime": 0,
        "reminder": 0,
        "changed": 0,
        "mapIndex":"0",
        "parentId":null,
        "role":17,  // 17 - автор, 18 - сполнитель, 19 - и то и то
        "actions":"227"
    },
    {
        "id":"13cb2b00-c37c-f52a-1f2a-59b934a4c248",
        "taskName":"Задача fghfghfgh",
        "taskDescription":"Описание задачи",
        "createTime":1442895357,

        "timeBeginAuthor": null,
        "timeEndAuhor": null,
        "dateBeginAuthor": 1457136000,
        "dateEndAuthor": 1457222400,

        "timeBeginPerformer": null,
        "timeEndPerformer": null,
        "dateBeginPerformer": 1457136000,
        "dateEndPerformer": 1457222400,

        "regularSetting":'{"SelectedSetting":"everyWeek"}',

        "author": "author@mail.ru",
        "performer": "performer@mail.ru",

        "shared":1,
        "directionBranch": "right",
        "viewBranch":"hide",
        "status":"delivered",
        "completeTime": 0,
        "reminder": 0,
        "changed": 0,
        "mapIndex":"0",
        "parentId":"13cb2b00-c37c-f52a-1f2a-59b934a4c238",
        "role":19,  // 17 - автор, 18 - сполнитель, 19 - и то и то
        "actions":"227"
    },
    {
        "id":"13cb2b00-c37c-f52a-1f2a-59b934a4c258",
        "taskName":"Задача убить всех людей",
        "taskDescription":"Описание задачи",
        "createTime":1442895357,

        "timeBeginAuthor": null,
        "timeEndAuhor": null,
        "dateBeginAuthor": 1457136000,
        "dateEndAuthor": 1457222400,

        "timeBeginPerformer": null,
        "timeEndPerformer": null,
        "dateBeginPerformer": 1457136000,
        "dateEndPerformer": 1457222400,

        "regularSetting":'{"SelectedSetting":"everyWeek"}',

        "author": "author@mail.ru",
        "performer": "performer@mail.ru",

        "shared":1,
        "directionBranch": "right",
        "viewBranch":"hide",
        "status":"delivered",
        "completeTime": 0,
        "reminder": 0,
        "changed": 0,
        "mapIndex":"0",
        "parentId":"13cb2b00-c37c-f52a-1f2a-59b934a4c238",
        "role":19,  // 17 - автор, 18 - сполнитель, 19 - и то и то
        "actions":"227"
    },
    {
        "id":"13cb2b00-c37c-f52a-1f2a-59b934a4c268",
        "taskName":"Купить атомную бомбу",
        "taskDescription":"Описание задачи",
        "createTime":1442895357,

        "timeBeginAuthor": null,
        "timeEndAuhor": null,
        "dateBeginAuthor": 1457136000,
        "dateEndAuthor": 1457222400,

        "timeBeginPerformer": null,
        "timeEndPerformer": null,
        "dateBeginPerformer": 1457136000,
        "dateEndPerformer": 1457222400,

        "regularSetting":'{"SelectedSetting":"everyWeek"}',

        "author": "author@mail.ru",
        "performer": "performer@mail.ru",

        "shared":1,
        "directionBranch": "right",
        "viewBranch":"hide",
        "status":"delivered",
        "completeTime": 0,
        "reminder": 0,
        "changed": 0,
        "mapIndex":"0",
        "parentId":"13cb2b00-c37c-f52a-1f2a-59b934a4c258",
        "role":19,  // 17 - автор, 18 - сполнитель, 19 - и то и то
        "actions":"227"
    },
    {
        "id":"13cb2b00-c37c-f52a-1f2a-59b934a4c278",
        "taskName":"Научиться пользоваться бомбой",
        "taskDescription":"Описание задачи",
        "createTime":1442895357,

        "timeBeginAuthor": null,
        "timeEndAuhor": null,
        "dateBeginAuthor": 1457136000,
        "dateEndAuthor": 1457222400,

        "timeBeginPerformer": null,
        "timeEndPerformer": null,
        "dateBeginPerformer": 1457136000,
        "dateEndPerformer": 1457222400,

        "regularSetting":'{"SelectedSetting":"everyWeek"}',

        "author": "author@mail.ru",
        "performer": "performer@mail.ru",

        "shared":1,
        "directionBranch": "right",
        "viewBranch":"hide",
        "status":"delivered",
        "completeTime": 0,
        "reminder": 0,
        "changed": 0,
        "mapIndex":"0",
        "parentId":"13cb2b00-c37c-f52a-1f2a-59b934a4c258",
        "role":19,  // 17 - автор, 18 - сполнитель, 19 - и то и то
        "actions":"227"
    }
];
