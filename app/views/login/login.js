/**
 * Created by Sergey on 10.02.2016.
 */
'use strict';

angular.module('bitaskApp.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/login', {
        templateUrl: './app/views/login/login.html',
        controller: 'LoginCtrl'
    }).when('/logout', {
        template:'',
        controller: function($location){



            $location.path('/')
        }
    });
}])

.controller('LoginCtrl', function($http, $scope, $rootScope, $route, $location, $window, $auth) {

    /**
     * Поля формы входа
     * @type {{username: string, password: string}}
     */
    $scope.textFields = {
        username: '',
        password: ''
    };

    /**
     * Вход через соц сеть
     * @param socialName
     */
    $scope.socialAuth = function (socialName) {

        $auth.authenticate(socialName).then(function(){

            $location.path('/');
        })

    };

    /**
     * Нажатие на кнопку войти
     */
    $scope.submit = function(){
        $http.post(bitaskAppConfig.api_url + 'index.php/auth/vk', {hello:'hello'});
    };

    /**
     * Нажатие на выход
     */
    $scope.logout = function () {
        $auth.logout();
        $location.url('/#/login');
    };

});
