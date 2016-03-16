/**
 * Created by SNKraynov on 18.02.2016.
 */
'use strict';

angular.module('bitaskApp.config', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/config', {
            templateUrl: './app/views/config/config.html',
            controller: 'ConfigCtrl'
        });
    }])
    .controller('ConfigCtrl', function($scope, $mdToast, $timeout, $window, localStorage) {

        // Получаем настройки из localStorage, если их там нет, берем из файла по умолчению
        var setting = localStorage.get('setting');
        if(!setting)
        {
            setting = bitaskAppConfig;
        }

        $scope.setting = setting;

        /**
         * Сохранить настройки
         */
        $scope.save = function(){

            localStorage.set('setting', $scope.setting);

            $mdToast.show({
                template:"<md-toast><span flex>Saved</span></md-toast>",
                position:'bottom right'
            });

            $timeout(function (){
                $window.location.reload(true);
            }, 1000);
        };

        /**
         * Сбросить настройки
         */
        $scope.setDefault = function (){

            localStorage.remove('setting');

            $mdToast.show({
                template:"<md-toast><span flex>Settings default</span></md-toast>",
                position:'bottom right'
            });

            $timeout(function (){
                $window.location.reload(true);
            }, 1000);
        }
    });