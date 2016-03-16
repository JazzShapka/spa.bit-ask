/**
 * Created by SNKraynov on 15.03.2016.
 */
angular.module('bitaskApp')
    /**
     * Вызывает обработчик полной отрисовки ngRepeat
     */
    .directive('onFinishRender', ['$timeout', '$log', function ($timeout, $log){
        var timer;
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {

                    if(timer)
                        $timeout.cancel(timer);
                    timer = $timeout(function () {
                        if(typeof scope[attr.onFinishRender] == 'function')
                        {
                            scope[attr.onFinishRender]();
                        }
                        else
                        {
                            $log.warn('onFinishRender - callback function ' + attr.onFinishRender + ' not found.');
                        }
                    });
                }
            }
        }
    }]);