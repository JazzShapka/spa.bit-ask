/**
 * Created by Sergey on 10.02.2016.
 */
'use strict';

angular.module('bitaskApp.login', ['ngRoute', 'bitaskApp.config', 'ngMaterial'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: './app/views/login/login.html',
            controller: 'LoginCtrl'
        })
        .when('/logout', {
            template:'',
            controller: function($location, $auth){
                $auth.logout();
                $location.path('/')
            }
        })
        .when('/change-password', {
            templateUrl:'./app/views/login/change-password.html',
            controller: 'LoginCtrl'
        })
        .when('/token', {
            template:'',
            controller: function($location, $auth){

                $location.path('/')
            }
        });
}])

.controller('LoginCtrl', function($http, $scope, $rootScope, $route, $location, $window, $auth, $mdToast) {

    /**
     * Поля формы входа
     * @type {{username: string, password: string}}
     */
    $scope.textFields = {
        email: '',
        password: '',
        username: ''
    };

    /**
     * Вход через соц сеть
     * @param socialName
     */
    $scope.socialAuth = function (socialName) {

        $auth.authenticate(socialName).then(function(){

            $location.path('/');
        });
    };

    /**
     * Нажатие на кнопку войти
     */
    $scope.login = function(){
        $http({
            url: bitaskAppConfig.auth_url + 'index.php/auth/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data:getFormData($scope.textFields)
        }).then(function (response){

            resetFields();

            switch (response.data[0]){
                case 200:{
                    $auth.setToken(response.data.token);
                    $location.path('/');
                    break;
                }
                default:{
                    $mdToast.show({
                        template: '<md-toast><span flex>'+ response.data[1] +'</span></md-toast>',
                        hideDelay: 6000,
                        position: 'right bottom'
                    });
                }
            }
        });
    };

    /**
     * Регистрация
     */
    $scope.registration = function (){

        $http({
            url: bitaskAppConfig.auth_url + 'index.php/auth/register',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data:getFormData($scope.textFields)
        }).then(function (response){
            switch (response.data[0])
            {
                case 200:{
                    resetFields();
                    $auth.setToken(response.data.token);
                    $location.path('/');
                    break;
                }
                default:{
                    $mdToast.show({
                        template: '<md-toast><span flex>'+ response.data[1] +'</span></md-toast>',
                        hideDelay: 6000,
                        position: 'right bottom'
                    });
                    break;
                }
            }
        });
    };

    /**
     * Напомнить пароль
     */
    $scope.recover = function (){

        var fields = {};
        fields.email = $scope.textFields.email;
        fields.addres = 'http://' + $location.host() + ($location.port()==80?'':':'+$location.port());

        $http({
            url: bitaskAppConfig.auth_url + 'index.php/auth/recover',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data:getFormData(fields)
        }).then(function (response){
            resetFields();
            $mdToast.show({
                template: '<md-toast><span flex>'+ response.data[1] +'</span></md-toast>',
                hideDelay: 6000,
                position: 'right bottom'
            });

        });
    };

    /**
     * Изменить пароль
     */
    $scope.changePassword = function (){
        $http({
            url: bitaskAppConfig.auth_url + 'index.php/auth/change-password',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data:getFormData($scope.textFields)
        }).then(function (response){
            resetFields();
            $mdToast.show({
                template: '<md-toast><span flex>'+ response.data[1] +'</span></md-toast>',
                hideDelay: 6000,
                position: 'right bottom'
            });

        });
    };

    /**
     * Нажатие на выход
     */
    $scope.logout = function () {
        $auth.logout();
        $location.url('/login');
    };

    /**
     * Преобразовать объект в formData
     * @param data
     * @returns {string}
     */
    function getFormData(data){

        var form_data = new FormData();


        var data_string = '';
        for(var field in data)
        {
            if(data.hasOwnProperty(field) && data[field] != '')
                data_string += field + '=' + encodeURIComponent(data[field]) + '&';
        }
        data_string = data_string.slice(0, -1);
        return data_string;
    }

    /**
     * Сбросить поля формы
     */
    function resetFields(){
        $scope.textFields.email = '';
        $scope.textFields.password = '';
        $scope.textFields.username = '';
    }

});
