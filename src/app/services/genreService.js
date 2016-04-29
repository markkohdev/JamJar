'use strict';

angular
  .module('jamjar')
  .factory('GenreService', function(APIService) {
    var service = this;

    service.model = 'genres';

    return {
      list: _.partial(APIService.list.bind(APIService), service.model),
    }
});

