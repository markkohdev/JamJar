'use strict';

angular
  .module('jamjar')
  .factory('ArtistService', function(APIService, $q) {
    var service = this;

    service.model = 'artists';

    return {
      // ng-autocomplete takes a promise returning an array
      // coax the artists out from the response here. TODO : errors?
      search: function(query, callback) {
        var q = $q.defer();
        var artistPromise = APIService.getPath(service.model + '/search/' + query + '/', function(err, resp) {
          if (err) return callback(err);
          if (callback) callback(err, resp);
        });

        artistPromise.then(function(resp){
          q.resolve(resp.data);
        });

        return q.promise;
      }
  }
});
