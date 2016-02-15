/**
 * Created by Sergey on 10.02.2016.
 */
'use strict';

myApp.factory('localStorage', function(){
    return {
        get: function(key){
            return JSON.parse(localStorage.getItem(key));
        },
        set: function(key, val){
            localStorage.setItem(key, JSON.stringify(val));
        },
        remove: function(key){
            localStorage.removeItem(key);
        },
        clear: function(){
            localStorage.clear();
        }
    }
});