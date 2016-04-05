'use strict';

angular
  .module('jamjar')
  .factory('SearchService', function(APIService) {
    var service = this;

    service.model = 'search';

    return {
      search: function(queryString, callback) {
        var escapedQueryString = encodeURIComponent(queryString);
        var searchPath = service.model + '/?q=' + escapedQueryString;

        APIService.getPath(searchPath, function(err, resp) {
          if (err) return callback(err);

          callback(null, resp);
        });
      },
  }
});
