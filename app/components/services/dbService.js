'use strict';

/* Services */

/**
 * Created by WebStorm.
 * User: ANLyhin
 * Date: 16.03.2016
 * Time: 09:55
 */

angular.module('bitaskApp.service.db', ['pouchdb'])

.service('dbService', ['$log', 'pouchDB', '$rootScope',
    function($log, pouchDB, $rootScope) {

        //console.log = function() {};
        console.log("Start dbService.");

        this.getDb = getDb;

        /**
         * Connect to db
         */
        function getDb() {
        	var db = pouchDB('dbname');

        	/*db.createIndex({
			  	index: {
			    	fields: ['id']
			  	}
			}).then(function (result) {
			  	// yo, a result
			  	console.log("db.createIndex result: ", result);
			}).catch(function (err) {
			  	// ouch, an error
			  	console.log("db.createIndex err: ", err);
			});*/


        	/*db.find({
			    selector: {name: 'Mario'},
			    fields: ['_id', 'name'],
			    sort: ['name']
			}).then(function (result) {
			    // yo, a result
			    console.log("db.find result: ", result);
			}).catch(function (err) {
			    // ouch, an error
			    console.log("db.find err: ", err);
			});*/

			/*db.allDocs({
			  	include_docs: true,
			  	attachments: true
			}).then(function (result) {
			  	// handle result
			  	console.log("db.allDocs: ", result);
			}).catch(function (err) {
			  	console.log("db.allDocs: " , err);
			});*/

        	return db;
        }

}])
