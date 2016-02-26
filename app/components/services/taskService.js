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
            {id:'5', name:'task_fife', index:98, parentId: null},
            {id:'6', name:'Тра та та', index:98, parentId: null},
            {id:'7', name:'Оло ло ло', index:98, parentId: null},
            {id:'8', name:'Тру ту ту', index:98, parentId: null},
            {id:'9', name:'Хе хей', index:98, parentId: null},
            {id:'10', name:'Задачка', index:98, parentId: null},
            {id:'11', name:'Суслик', index:98, parentId: null},
            {id:'12', name:'!!!!!!!!!', index:98, parentId: null},
            {id:'13', name:'Пшшшшшшш', index:98, parentId: null},
            {id:'14', name:'Винни пух', index:98, parentId: null},
            {id:'15', name:'Пятачек', index:98, parentId: null},
            {id:'16', name:'Иа', index:98, parentId: null}
        ];


    });