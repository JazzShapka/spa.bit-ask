/**
 * Created by SNKraynov on 19.02.2016.
 */
angular.module('bitaskApp.service.task', [])
    .service('tasks', function ($interval){

        var self = this;

        self.tasks = [
            {id:'1', name:'task_one', index:23, parentId: null},
            {id:'2', name:'task_two', index:32, parentId: null},
            {id:'3', name:'task_three', index:72, parentId: null},
            {id:'4', name:'task_four', index:45, parentId: null},
            {id:'5', name:'task_fife', index:98, parentId: null}
        ];


    });