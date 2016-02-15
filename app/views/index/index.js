'use strict';

angular.module('bitaskApp.index', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
      templateUrl: './app/views/index/index.html',
      controller: 'IndexCtrl'
  });
}])

.controller('IndexCtrl', [function() {

}]);