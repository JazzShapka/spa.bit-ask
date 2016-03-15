/**
 * Created by SNKraynov on 11.03.2016.
 */
angular.module('bitaskApp.service.keyboard', [])
    /**
     * Сервис клавиатуры, позволяет избежать конфликтов обработчиков окон.
     *
     * Отправляет событие только последнему окну зарегестрировавшему
     * обработчик.
     *
     * keyboardService.on(keypressFun, keydownFun, keyupFun) - устанавливает обработчик, в функцию
     * передается объект события.
     * Можно передать только одну из функций например так -
     * keyboardService.on(null, keydownFun, null);
     *
     * keyboardService.off() - удаляет последние зарегестрированые обработчики.
     *
     * ВНИМАНИЕ !!! Нужно избежать программно лишнее удаление обработчика, в случаи
     * случайного нажатия пользователем кнопки несколько раз, например при
     * закрытии окна.
     */
    .service('keyboardService', ['$document', function ($document){

        var self = this;

        var stack = [];

        self.on = function (keypressFun, keydownFun, keyupFun){
            stack.push([
                keypressFun,
                keydownFun,
                keyupFun
            ]);

            if(stack.length > 10)
                stack.shift();

        };
        self.off = function (){
            stack.pop();
        };

        $document.on('keypress', function (event){
            if(stack[stack.length-1] && typeof stack[stack.length-1][0] == 'function')
                stack[stack.length-1][0](event);
        });
        $document.on('keydown', function (event){
            if(stack[stack.length-1] && typeof stack[stack.length-1][1] == 'function')
                stack[stack.length-1][1](event);
        });
        $document.on('keyup', function (event){
            if(stack[stack.length-1] && typeof stack[stack.length-1][2] == 'function')
                stack[stack.length-1][2](event);
        });

    }]);
