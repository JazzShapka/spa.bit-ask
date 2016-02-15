'use strict';

angular.module('application.header', [
    'ngRoute'
])

.controller('HeaderCtrl', function($scope, $location){

    $scope.subMenu = [
        {
            type: 'users',
            href: './users/list/',
            name: 'Список пользователей'
        },
        {
            type: 'users',
            href: './users/rights/',
            name: 'Права пользователей'
        },
        {
            type: 'users',
            href: './users/profile/',
            name: 'Мой профиль'
        },
        {
            type: 'distributors',
            href: './distributors/distrList/',
            name: 'Дистрибьюторы'
        },
        {
            type: 'distributors',
            href: './distributors/order/',
            name: 'Заказы'
        },
        {
            type: 'distributors',
            href: './distributors/stock/',
            name: 'Ассортимент'
        },
        {
            type: 'distributors',
            href: './distributors/priceList/',
            name: 'Прайс-лист'
        },
        {
            type: 'distributors',
            href: './distributors/debt/',
            name: 'Дебиторская задолженность'
        },
        {
            type: 'distributors',
            href: './distributors/remains/',
            name: 'Остатки на складах'
        },
        {
            type: 'distributors',
            href: './distributors/qualifier/',
            name: 'Классификатор групп'
        }
    ];

});