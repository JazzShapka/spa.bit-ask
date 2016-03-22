/**
 * Created by SNKraynov on 21.03.2016.
 */
angular.module('bitaskApp.service.feed', [
        'bitaskApp.service.buffer',
        'uuid4'
    ])
    .service('feedService', ['$timeout', '$mdDialog', 'bufferService', 'uuid4', 'keyboardService', 'taskService',
        function ($timeout, $mdDialog, bufferService, uuid4, keyboardService, taskService){

            var self = this;

            self.feeds = [];
            self.feeds_indexed = {};

            /**
             * Обновить объекты
             */
            var refreshObjects = function (){

            }

            var __constructor = function (){

                // Получаем все новости
                bufferService.send([[uuid4.generate(), false, "card/list"]], function (data){

                    // Добавляем все новости в массив отображения
                    for(var i=0; i<data.length; i++)
                    {
                        // Индексируем массив карточек (новостей)
                        self.feeds_indexed[data[i].id] = data[i];

                        switch (data[i].type)
                        {
                            case 'task':{

                                // Заменяем id объекта, на реальный объект
                                data[i].objects[0] = taskService.tasks_indexed[data[i].objects[0].objectId];

                                // Показываем карточки только с загруженными объектами
                                data[i].show = data[i].objects[0] !== undefined;

                                self.feeds.push(data[i]);
                            }
                        }

                    }
                });
            };
            __constructor();
        }
    ]);