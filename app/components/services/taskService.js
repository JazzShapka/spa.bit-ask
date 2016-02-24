/**
 * Created by SNKraynov on 19.02.2016.
 */
angular.module('bitaskApp.service.task', [])
    .service('tasks', function (){

        this.tasks = [
            {id:'1', name:'task_one', index:23},
            {id:'2', name:'task_two', index:32},
            {id:'3', name:'task_three', index:72},
            {id:'4', name:'task_four', index:45},
            {id:'5', name:'task_fife', index:98}
        ]

    });