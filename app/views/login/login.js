/**
 * Created by Sergey on 10.02.2016.
 */
'use strict';

angular.module('myApp.login', ['ngRoute'])

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

.controller('LoginCtrl', function($scope) {
    $scope.submit = function(){

        $scope.login;
        $scope.password;

        debugger;
    };


    //debugger;

});
