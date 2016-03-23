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


        var object_number = 0;                  // Номер прижатой к верху карточки.


        $scope.feeds = feedService.feeds;       // Новости (карточки)


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


        /**
         * Обработчик прокрутки колесика мыши.
         *
         * Используется для управления скролом на странице и прижатию
         * карточки к верху страницы
         *
         * @param event
         */
        var onMousewheel = function (event){

            var scroll = $scope.nice_scroll[0];

            var objects = angular.element('.feed_scroll').children(); // Карточки
            var scroll_position_top = scroll.getScrollTop();

            if(event.deltaY < 0 && (objects.length - 2) > object_number)
            {
                object_number ++;
                scroll.doScrollTo(angular.element(objects[object_number]).offset().top + (scroll_position_top - 68));

            }
            else if(event.deltaY > 0 && object_number > 0)
            {
                object_number --;
                scroll.doScrollTo(angular.element(objects[object_number]).offset().top + (scroll_position_top - 68));

            }
        };

        /**
         * Обработчик событий клавиатуры
         */
        keyboardService.on(function (){
            //console.log('index - keypress');
        });
    }
]);