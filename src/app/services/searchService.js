'use strict';

function handleVenue(venue) {
  return {
    type: 'venue',
    icon: 'home',
    name: venue.name,
    details: venue.formatted_address,
  }
}

function handleUser(user) {
  return {
    type: 'user',
    icon: 'person',
    name: user.username,
    details: null
  }
}

function handleVideo(video) {
  return {
    type: 'video',
    icon: 'videocam',
    name: video.name,
    details: 'Uploaded by ' + video.user.username
  }
}

function handleConcert(concert) {
  return {
    type: 'concert',
    icon: 'local_play',
    name: concert.venue.name + ' on ' + concert.date,
    details: "Featuring " + _.map(concert.artists, 'name').join(", ")
  }
}

function handleArtist(artist) {
  return {
    type: 'artist',
    icon: 'mic',
    name: artist.name,
    details: null
  }
}

angular
  .module('jamjar')
  .factory('SearchService', function(APIService, $q) {
    var service = this;

    service.model = 'search';

    service.resultTypeHandler = {
      venue   : handleVenue,
      user    : handleUser,
      video   : handleVideo,
      concert : handleConcert,
      artist  : handleArtist

    }

    return {
      search: function(queryString, callback) {
        var escapedQueryString = encodeURIComponent(queryString);
        var searchPath = service.model + '/?q=' + escapedQueryString;
        var q = $q.defer();

        var searchPromise = APIService.getPath(searchPath);

        searchPromise.then(function(resp){
          var data = resp.data;

          // data is an object that looks like this {venue: [], user: [], video: [], concert: [], artist:[]}
          // squash all of these down to a single (ordered) array where each element has a type

          var searchResults = _.flatten(_.map(_.keys(data), function(key) {
            var items = data[key];
            return _.map(items, service.resultTypeHandler[key]);
          }));

          // flatten the list of lists
          q.resolve(searchResults);
        });

        return q.promise;
      },
  }
});
