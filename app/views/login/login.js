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


    $scope.checkUser = function(){
        $scope.userApi = $scope.userData != undefined;
    };
    $scope.checkUser();

    $scope.logout = function () {

    };

    $scope.textFields = {
        username: '',
        password: ''
    };

    $scope.socialAuth = function (socialName) {

        $auth.authenticate(socialName);

    };

    $scope.logged = function () {
        console.log($scope.textFields);
    };

    $scope.submit = function(){
        $http.post(bitaskAppConfig.api_url + 'index.php/auth/vk', {hello:'hello'});
    };


    //debugger;

});
