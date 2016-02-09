'use strict';

angular.module('myApp.index', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: './app/views/index/index.html',
    controller: 'IndexCtrl'
  });
}])

.controller('IndexCtrl', [function() {

}]);