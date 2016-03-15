/**
 * Created by SNKraynov on 15.03.2016.
 */
angular.module('bitaskApp.service.user', [
    'uuid4',
    'bitaskApp.service.buffer'
])

    .service('userService', ['uuid4', '$auth', 'bufferService', '$log',
        function (uuid4, $auth, bufferService, $log){
            var self = this;

            self.getValue = function (key, fun){
                bufferService.send([[uuid4.generate(), false, "user/getvalue", {key:key}]], fun);
            };
            self.setValue = function (key, value){
                bufferService.send([[uuid4.generate(), false, "user/setvalue", {key:key, value:value}]]);
            };
        }
    ]);