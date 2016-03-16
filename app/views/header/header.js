/**
 * Created by SNKraynov on 16.02.2016.
 */
'use strict';

angular.module('bitaskApp.header', ['ngAnimate'])
    .controller('HeaderCtrl', function($scope, $mdSidenav) {

        $scope.toggle = function (){
            $mdSidenav('sidenav-left').toggle();
        };

    })
    .controller('LeftMenuCtrl', function ($scope, $mdSidenav){

        $scope.hideLeftToolbar = function (){
            $mdSidenav('sidenav-left').close();
        }
    });