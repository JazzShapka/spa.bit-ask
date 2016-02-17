'use strict';

// Объявления приложения и модулей для представлений и компонент
var bitaskApp = angular.module('bitaskApp', [
    'ngRoute',
    'ngMaterial',
    'satellizer',
    'bitaskApp.index',
    'bitaskApp.view1',
    'bitaskApp.view2',
    'bitaskApp.login',
    'bitaskApp.header',
    'bitaskApp.floating_button'
])

// Конфигурация роутера
.config(['$routeProvider', '$httpProvider' ,'$locationProvider', '$authProvider', 'SatellizerConfig',

    function($routeProvider, $httpProvider, $locationProvider, $authProvider, SatellizerConfig) {

        //Используем html5 router, когда точка входа идёт на старт приложения
        $locationProvider.html5Mode(true);

        //Использование для кроссдоменных платформ
        $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
        $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        // Eсли стр нет то выкинет на логинн
        $routeProvider.otherwise({redirectTo: '/'});

        // Настраиваем провайдер vk
        SatellizerConfig.providers['vk'] = {
            name: 'vk',
            clientId: bitaskAppConfig.vk_id,
            url: bitaskAppConfig.api_url + 'index.php/auth/vk',
            authorizationEndpoint: 'https://oauth.vk.com/authorize',
            scope: 'email',
            redirectUri: window.location.origin,
            type: '2.0',
            popupOptions: { width: 700, height: 380 }
        };

        $authProvider.google({
            clientId: bitaskAppConfig.google_id,
            url: bitaskAppConfig.api_url + 'index.php/auth/google'
        });
        $authProvider.authToken = false;
        $authProvider.tokenName = "token";
    }
])

//На каждое удачно изменение роутера мы обновляем router, который можно использовать в любом тимплейте {{router}}
.run(['$rootScope','$location', '$auth', function($rootScope, $location, $auth) {

    $rootScope.router = $location.path();
    $rootScope.$on('$routeChangeSuccess', function (event, current) {

        // Если пользователь авторизован отправляем его в корень
        if($auth.isAuthenticated() && $location.path() == "/login")
        {
            $location.url('/');
        }
        // Если не авторизован кидаем его на страницу авторизации
        else if(!$auth.isAuthenticated()){
            $location.url('/login');
        }

        $rootScope.router = $location.path();
        $rootScope.current = current.$$route;
    });

}]);

