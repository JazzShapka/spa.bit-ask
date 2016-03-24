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
             * Отработка принятого решения по карточке
             *
             * @param cardId (string) - id карточки
             * @param decision (string) - принятое решение
             * @param otherInfo (object) - дополнительные данные {key:value}
             */
            self.decision = function (cardId, decision, otherInfo){

                var card = self.feeds_indexed[cardId];

                switch(decision)
                {
                    // Завершить задачу
                    case 'task/completed':{

                        bufferService.send([[uuid4.generate(), true, 'card/decision', {id:card.id, decision:'complete'}]]);
                        taskService.editTask(card.objects[0].id, {status: 'completed'});
                    }
                }

                deleteFeed(cardId);
            };

            self.showTaskEditor = function (taskId){
                taskService.showTaskEditor('edit', taskId);
            };

            /**
             * Удалить карточку.
             * @param cardId
             */
            var deleteFeed = function (cardId){

                for(var i=0; i<self.feeds.length; i++)
                {
                    if(self.feeds[i].id == cardId)
                    {
                        self.feeds.splice(i, 1);
                        break;
                    }
                }
                delete self.feeds_indexed[cardId];
            };

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