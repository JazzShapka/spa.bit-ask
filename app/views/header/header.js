/**
 * Created by SNKraynov on 16.02.2016.
 */
'use strict';

angular.module('bitaskApp.header', ['ngAnimate'])
    .controller('HeaderCtrl', function($scope) {

        $scope.left_toolbar = {
            show:false
        };

        $scope.showLeftToolbar = function (){
            $scope.left_toolbar.show = true;
        };

        $scope.hideLeftToolbar = function(){
            $scope.left_toolbar.show = false;
        };

    });