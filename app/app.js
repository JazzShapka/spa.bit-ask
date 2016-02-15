'use strict';

// Объявления приложения и модулей для представлений и компонент
var myApp = angular.module('myApp', [
    'ngRoute',
    'lumx',
    'myApp.index',
    'myApp.view1',
    'myApp.view2',
    'myApp.login'
])

// Конфигурация роутера
.config(['$routeProvider', '$httpProvider' ,'$locationProvider', function($routeProvider, $httpProvider, $locationProvider) {
    //Используем html5 router, когда точка входа идёт на старт приложения
    $locationProvider.html5Mode(true);

    //Использование для кроссдоменных платформ
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.headers.common = 'Content-Type: application/json';
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    //если стр нет то выкинет на логинн
    $routeProvider.otherwise({redirectTo: '/'});
    //добовляем провайдеру Interceptor (см в вюм-логин)
    //$httpProvider.interceptors.push('authInterceptor');
}])

//На каждое удачно изменение роутера мы обновляем router, который можно использовать в любом тимплейте {{router}}
.run(['$rootScope','$location', function($rootScope, $location, localStorage) {


    $rootScope.router = $location.path();
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.router = $location.path();
        $rootScope.current = current.$$route;
    });

}]);

