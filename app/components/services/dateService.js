/**
 * Created by SNKraynov on 02.03.2016.
 */
angular.module('bitaskApp.service.date', [])
    .service('dateService', function (){

        var self = this;

        Object.defineProperty(self, "dateServer", {
            get:function (){

                var date = new Date();
                date.setSeconds(0, 0);
                date.setUTCMinutes(0);
                date.setUTCHours(0);

                return date.getTime()/1000;
            }
        });
    });
