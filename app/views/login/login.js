/**
 * Created by Sergey on 10.02.2016.
 */
'use strict';

angular.module('bitaskApp.login', ['ngRoute', 'bitaskApp.config', 'ngMaterial'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/auth/login', {
                templateUrl: './app/views/login/login.html',
                controller: 'LoginCtrl'
            })
            .when('/auth/logout', {
                template:'',
                controller: function($location, $auth){
                    $auth.logout();
                    $location.path('/');
                }
            })
            .when('/auth/change-password', {
                templateUrl:'./app/views/login/change-password.html',
                controller: 'LoginCtrl'
            })
            .when('/auth/token', {
                templateUrl:'./app/views/login/reminder-password.html',
                controller: 'LoginCtrl'
            });
    }])

    .run(['$rootScope', '$location', '$auth', function ($rootScope, $location, $auth){

        $rootScope.$on('$routeChangeSuccess', function (event, current) {

            var auth_page = $location.path().split('/')[1] == 'auth';

            // Если пользователь авторизован отправляем его в корень
            if($auth.isAuthenticated() && auth_page && $location.path() != '/auth/change-password')
            {
                $location.url('/');
            }
            // Если не авторизован кидаем его на страницу авторизации  и разрешаем переход на settings
            else if(!$auth.isAuthenticated() && $location.path() != "/config" && !auth_page)
            {
                $location.url('/auth/login');
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

                switch (response.data[0]){
                    case 200:{
                        $auth.setToken(response.data.token);
                        $location.path('/');
                        resetFields();
                        break;
                    }
                    default:{
                        $scope.textFields.password = '';
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
            fields.address = 'http://' + $location.host() + ($location.port()==80?'':':'+$location.port()) + '/auth/token';

            $http({
                url: bitaskAppConfig.auth_url + 'index.php/auth/recover',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data:getFormData(fields)
            }).then(function (response){
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

            var fields = {};
            fields.password = $scope.textFields.password;

            $http({
                url: bitaskAppConfig.auth_url + 'index.php/auth/change-password',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data:getFormData(fields)
            }).then(function (response){
                $mdToast.show({
                    template: '<md-toast><span flex>'+ response.data[1] +'</span></md-toast>',
                    hideDelay: 6000,
                    position: 'right bottom'
                });
                $window.history.back();
            });
        };

        /**
         * Сброс пароля (по ссылке из письма)
         */
        $scope.setPassword = function (){
            var fields = {};
            fields.password = $scope.textFields.password;
            fields.token = $location.search().token;

            $http({
                url: bitaskAppConfig.auth_url + 'index.php/auth/change-password',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data:getFormData(fields)
            }).then(function (response){

                if(response.data[0] == 200)
                {
                    $auth.setToken(response.data.token);
                    $location.path('/');
                    resetFields();
                }
            });
        };

        /**
         * Нажатие на выход
         */
        $scope.logout = function () {
            $auth.logout();
            $location.url('/auth/login');
        };

        /**
         * Кнопка назад
         */
        $scope.back = function (){
            $window.history.back();
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
