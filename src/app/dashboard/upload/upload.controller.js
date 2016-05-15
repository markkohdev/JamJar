(function () {
  'use strict';
  angular
      .module('jamjar')
      .controller('UploadController', UploadController);

  function UploadController (ArtistService, $scope, $stateParams) {
    var vm = this;
      
    vm.concertValues = {
      'artists' : $stateParams.artists,
      'date'    : $stateParams.date,
      'venue'   : $stateParams.venue
    };
      
    vm.selectedItem = null;
    vm.searchText = null;
    vm.selectedArtists = [];
    vm.autocompleteRequireMatch = false;

    window.lol = vm;

    vm.concertInput = null;
    vm.concertVenue = null;
    vm.concertDate = null;  
    
    vm.artistSearch = function(query) {
      return ArtistService.search(query);
    }
    
    if($stateParams.artists != null) {
        var artistArr = vm.concertValues.artists.split(', ');
        
        _.each(artistArr, function(artistStr) {
            var artistPromise = ArtistService.search(artistStr);
            artistPromise.then(function(artists) {
              vm.selectedArtists.push(artists[0]);
            }); 
        });
    }
      
    if($stateParams.date != null) {
        var rawDate = new Date(vm.concertValues.date);
        //normalize the date and eliminate unwanted offset
        vm.concertDate = new Date(rawDate.getTime() + rawDate.getTimezoneOffset()*60000);
    }
      
    if($stateParams.venue != null) {
        //PlacesService object requires a HTML element to be created
        var obj = angular.element('<div>').append('</div>');
        var placesService = new google.maps.places.PlacesService(obj.get(0));

        placesService.getDetails(
            {placeId: vm.concertValues.venue},
            function(placeResult, serviceStatus) {
                console.log(placeResult.name);
                vm.concertInput = placeResult.name;
                vm.concertVenue = placeResult;
            }
        );
    }

    vm.videoDetails = function() {
      return function() {
        return {
          'venueString' : vm.concertInput,
          'venue': vm.concertVenue,
          'date': vm.concertDate,
          'artists': vm.selectedArtists
        }
      }
    }

    /* Return the proper object when the append is called*/
    vm.transformChip = function(chip) {
      var controller = vm;
      // If it is an object, it's already a known chip
      if (angular.isObject(chip)) {
        return chip;
      }
      // Otherwise, create a new one
      else{
          return { name: chip }
      }
    }
  }
})();
