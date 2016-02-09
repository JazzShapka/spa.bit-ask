'use strict';

// Declare app level module which depends on views, and components
// ���������� ���������� � ������� ��� ������������� � ���������
var myApp = angular.module('myApp', [
    'ngRoute',
    'lumx',
    'myApp.index',
    'myApp.view1',
    'myApp.view2'
])

//������������ �������
.config(['$routeProvider', '$httpProvider' ,'$locationProvider', function($routeProvider, $httpProvider, $locationProvider) {
    //���������� html5 router, ����� ����� ����� ��� �� ����� ����������
    $locationProvider.html5Mode(true);
    //������������� ��� ������������� ��������
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.headers.common = 'Content-Type: application/json';
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    //TODO: �������� �����,
    //���� ��� ��� �� ������� �� ������
    //$routeProvider.otherwise({redirectTo: '/login'});
    //��������� ���������� Interceptor (�� � ���-�����)
    //$httpProvider.interceptors.push('authInterceptor');
}])

//�� ������ ������ ��������� ������� �� ��������� router, ������� ����� ������������ � ����� ��������� {{router}}

.run(['$rootScope','$location', function($rootScope, $location) {
    $rootScope.router = $location.path();
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.router = $location.path();
        $rootScope.current = current.$$route;
    });

}]);

