'use strict';

// Объявления приложения и модулей для представлений и компонент
angular.module('bitaskApp', [
    'ngRoute',
    'ngMaterial',
    'ngAnimate',
    'ngDraggable',
    'satellizer',
    'angular-nicescroll',

    'bitaskApp.index',
    'bitaskApp.goals',
    'bitaskApp.schedule',
    'bitaskApp.login',
    'bitaskApp.header',
    'bitaskApp.floating_button',
    'bitaskApp.config',
    'bitaskApp.hierarchy_task',
    'bitaskApp.service.task',
    'bitaskApp.service.buffer',
    //'stompService',
    'buffer'
    //'stompdk'
])

// Конфигурация приложения
.config(['$routeProvider', '$httpProvider' ,'$locationProvider', '$authProvider',

    function($routeProvider, $httpProvider, $locationProvider, $authProvider) {

        //Используем html5 router, когда точка входа идёт на старт приложения
        $locationProvider.html5Mode(true);

        //Использование для кроссдоменных платформ
        $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
        $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        //TODO: Сделать обработку ошибки доступа
        $httpProvider.interceptors.push(function (){
            return {
                request: function (request) {
                    return request;
                },
                response: function (response){
                    return response;
                },
                responseError: function (response) {
                    return response;
                }
            }
        });

        // Eсли стр нет то выкинет в корень
        $routeProvider.otherwise({redirectTo: '/'});


        // Получаем сохраненные настройки, если они есть
        var setting = JSON.parse(localStorage.getItem('setting'));
        if(setting)
        {
            bitaskAppConfig = setting;
        }

        // Настраиваем сервис авторизации
        $authProvider.google({
            clientId: bitaskAppConfig.google_id,
            url: bitaskAppConfig.auth_url + 'index.php/auth/google'
        });
        $authProvider.facebook({
            clientId: bitaskAppConfig.facebook_id,
            url: bitaskAppConfig.auth_url + 'index.php/auth/facebook'
        });
        $authProvider.authToken = false;
        $authProvider.tokenName = "token";
    }
])

//На каждое удачно изменение роутера мы обновляем router, который можно использовать в любом тимплейте {{router}}
.run(['$rootScope','$location', '$auth', function($rootScope, $location, $auth) {

    $rootScope.router = $location.path();
    $rootScope.$on('$routeChangeSuccess', function (event, current) {

        $rootScope.router = $location.path();
        $rootScope.current = current.$$route;

        var auth_page = $rootScope.router.split('/')[1] == 'auth';
        // Если изображена страица авторизации или конфиг не показываем шапку и снежинку
        $rootScope.show_menu = !auth_page && $rootScope.router!='/config';
    });
}]);

