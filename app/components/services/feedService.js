/**
 * Created by SNKraynov on 21.03.2016.
 */
angular.module('bitaskApp.service.feed', [
        'bitaskApp.service.buffer',
        'uuid4'
    ])
    .service('feedService', ['$timeout', '$mdDialog', 'bufferService', 'uuid4', 'keyboardService',
        function ($timeout, $mdDialog, bufferService, uuid4, keyboardService){

            var self = this;

            self.feeds = [];

            var __constructor = function (){

                // Получаем все новости
                bufferService.send([[uuid4.generate(), false, "card/list"]], function (data){

                    // Добавляем все задачи в массив отображения
                    for(var i=0; i<data.length; i++)
                    {
                        self.feeds.push(data[i]);
                    }

                });
            };
            __constructor();
        }
    ]);