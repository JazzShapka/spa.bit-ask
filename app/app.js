'use strict';

// Объявления приложения и модулей для представлений и компонент
var bitaskApp = angular.module('bitaskApp', [
    'ngRoute',
    'ngMaterial',
    'ngAnimate',
    'satellizer',
    'bitaskApp.index',
    'bitaskApp.view1',
    'bitaskApp.view2',
    'bitaskApp.login',
    'bitaskApp.header',
    'bitaskApp.floating_button',
    'bitaskApp.config'
])

// Конфигурация роутера
.config(['$routeProvider', '$httpProvider' ,'$locationProvider', '$authProvider',

    function($routeProvider, $httpProvider, $locationProvider, $authProvider) {

        //Используем html5 router, когда точка входа идёт на старт приложения
        $locationProvider.html5Mode(true);

        //Использование для кроссдоменных платформ
        $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
        $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        // Eсли стр нет то выкинет на логинн
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
.run(['$rootScope','$location', '$auth', 'localStorage', function($rootScope, $location, $auth, localStorage) {

    $rootScope.router = $location.path();
    $rootScope.$on('$routeChangeSuccess', function (event, current) {

        // Если пользователь авторизован отправляем его в корень
        if($auth.isAuthenticated() && $location.path() == "/login")
        {
            $location.url('/');
        }
        // Если не авторизован кидаем его на страницу авторизации  и разрешаем переход на settings
        else if(!$auth.isAuthenticated() && $location.path() != "/config")
        {
            $location.url('/login');
        }

        $rootScope.router = $location.path();
        $rootScope.current = current.$$route;
    });
}]);

