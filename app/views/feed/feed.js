'use strict';

angular.module('bitaskApp.index', ['ngRoute', 'angular-nicescroll', 'bitaskApp.service.keyboard', 'bitaskApp.service.feed'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
      templateUrl: './app/views/feed/feed.html',
      controller: 'FeedCtrl'
  });
}])

.controller('FeedCtrl', ['$scope', '$http', 'feedService', 'keyboardService', '$timeout', '$window',
    function($scope, $http, feedService, keyboardService, $timeout, $window) {

        var scroll_main_page = false,
            object_number = 0,                      // Номер прижатой к верху карточки.
            event_blocked = false;                  // Блокировка события скролла


        $scope.feeds = feedService.feeds;       // Новости (карточки)

        $scope.$watch($scope.nice_scroll, function (){
            if(!scroll_main_page)
            {
                scroll_main_page = $scope.nice_scroll[0];




                angular.element('.feed_scroll').mousewheel(function (event){

                    //scroll_main_page.newscrolly = 500
                    //return false;


                    /*var new_scrol_position = scroll_main_page.getScrollTop();
                    var objects = angular.element('.feed_scroll').children(); // Карточки

                    // вниз (следующая карточка)
                    if(position + 40 < new_scrol_position && object_number < objects.length && !event_blocked)
                    {
                        position = new_scrol_position;
                        event_blocked = true;

                        scrollToObject(objects[object_number], function (){
                            event_blocked = false;
                        });

                        object_number ++;
                        console.log('вниз', position);
                    }
                    // вверх (предыдущая карточка)
                    else if(position - 40 > new_scrol_position && object_number >= 0 && !event_blocked)
                    {
                        position = new_scrol_position;
                        object_number --;
                        console.log("вверх", position);
                    }
                    else {
                        return false
                    }*/
                });
            }
        });
        /**
         * Нажатие на кнопку - "Принятие решения"
         *
         * @param cardId
         * @param decision
         */
        $scope.decision = function (cardId, decision){
            feedService.decision(cardId, decision);
        };
        /**
         * Показать рерактор задачи
         * @param taskId
         */
        $scope.showTaskEditor = function (taskId){
            feedService.showTaskEditor(taskId);
        };
        /**
         * Настраивает скролл на странице.
         *
         * Возвращает настройки для nice scroll
         *
         * @returns {{cursorcolor: string, zindex: number}}
         */
        $scope.getNiceScrollOption = function (){

            angular.element('.feed_scroll').mousewheel(onMousewheel);
            return {
                cursorcolor: '#424242',
                zindex:81,
                preservenativescrolling:true,
                enablekeyboard:false,
                enablemousewheel:false
            }
        };


        var onMousewheel = function (event){

            var objects = angular.element('.feed_scroll').children(); // Карточки
            var scroll_position_top = scroll_main_page.getScrollTop();;

            if(event.deltaY < 0 && (objects.length - 2) > object_number)
            {
                object_number ++;
                scroll_main_page.doScrollTo(angular.element(objects[object_number]).offset().top + (scroll_position_top - 68));

            }
            else if(event.deltaY > 0 && object_number > 0)
            {
                object_number --;
                scroll_main_page.doScrollTo(angular.element(objects[object_number]).offset().top + (scroll_position_top - 68));

            }
        };

        keyboardService.on(function (){
            console.log('index - keypress');
        });
    }
]);