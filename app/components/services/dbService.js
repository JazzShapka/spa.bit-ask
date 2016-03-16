'use strict';

/* Services */

/**
 * Created by WebStorm.
 * User: ANLyhin
 * Date: 16.03.2016
 * Time: 09:55
 */

angular.module('bitaskApp.service.db', ['ngResource', 'uuid4', 'LocalStorageModule', 'angular-cache', 'offline', 'pouchdb', 'AngularStompDK'])

.service('dbService', ['$resource', '$http', '$auth', 'uuid4', 'localStorageService', 'CacheFactory', 'offline', 'connectionStatus', '$log', '$q', 'pouchDB', '$timeout', '$rootScope', 'ngstomp',
    function($resource, $http, $auth, uuid4, localStorageService, CacheFactory, offline, connectionStatus, $log, $q, pouchDB, $timeout, $rootScope, ngstomp) {

        console.log("Start dbService.");
        //var db = pouchDB('dbname');

        this.getDb = getDb;
        function getDb() {
        	var db = pouchDB('dbname');
        	return db;
        }

}])
