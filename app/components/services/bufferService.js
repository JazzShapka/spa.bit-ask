var bufferService = angular.module('bufferService', ['ngResource']);

bufferService.factory('bufferService', ['$resource', '$http', '$auth',
    function($resource, $http, $auth) {
        console.log("bufferService: ");

        //debugger;
        console.log ($auth.getToken());
        var obj = {};

        obj.getCard = function(par) {
            var CreditCard = $resource('/user/:userId/card/:cardId',
            {userId:par, cardId:'@id'}, {
                charge: {method:'POST', params:{charge:true}}
            });

            var newCard = new CreditCard({number:par});
            newCard.name = "Mike Smith";
            newCard.$save();

            console.log("NC: ",  newCard);
            return newCard;
        }

        // POST: /user/123/card {number:'0123', name:'Mike Smith'}
        // server returns: {id:789, number:'0123', name: 'Mike Smith'};
        obj.getBooks = function() {
            console.log("getBooks: ");
            return $http.get(serviceBase + 'books');
        }

        return obj;
}])
