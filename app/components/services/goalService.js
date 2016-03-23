/**
 * Created by SNKraynov on 21.03.2016.
 */
angular.module('bitaskApp.service.goal', [
        'bitaskApp.service.buffer',
        'uuid4'
    ])
    .service('goalService', ['$timeout', '$mdDialog', 'bufferService', 'uuid4', 'keyboardService', '$auth',
        function ($timeout, $mdDialog, bufferService, uuid4, keyboardService, $auth){

            var self = this;

            self.goals = [];                // Массив загруженых целей
            self.goals_indexed = {};        // Проиндексированный массив загруженных целей

            /**
             * Конструктор.
             *
             * Получает список целей с сервера.
             *
             * @private
             */
            var __constructor = function (){

                var userId = $auth.getPayload().sub;
                // Получаем все цели
                bufferService.send([[uuid4.generate(), false, "target/list", {userId:userId}]], function (data){

                    // Добавляем все новости в массив отображения
                    for(var i=0; i<data.length; i++)
                    {
                        // Индексируем массив карточек (новостей)
                        self.goals_indexed[data[i].id] = data[i];
                        self.goals.push(data[i]);
                    }
                });
            };
            __constructor();
        }
    ]);