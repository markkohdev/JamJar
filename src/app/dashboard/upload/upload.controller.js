(function () {
  'use strict';
  angular
      .module('jamjar')
      .controller('UploadController', UploadController);

  function UploadController (AuthService, TokenService, ArtistService, $scope, $stateParams) {
    var vm = this;
      
    if (!AuthService.getUser()) {
       TokenService.onUnauthorized();
    }

    vm.concertValues = {
      'artists' : $stateParams.artists,
      'date'    : $stateParams.date,
      'venueId' : $stateParams.venueId
    };
      
    vm.selectedItem = null;
    vm.searchText = null;
    vm.selectedArtists = [];
    vm.autocompleteRequireMatch = false;

    vm.concertDate = null;
      
    vm.venueName = null;
    vm.venueId = null;  
    vm.venueDetails = null;
    
    window.lol = vm;
      
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
      
    if($stateParams.venueId != null) {
        vm.venueId = $stateParams.venueId;
        
        //PlacesService object requires a HTML element to be created
        var obj = angular.element('<div>').append('</div>');
        var placesService = new google.maps.places.PlacesService(obj.get(0));

        placesService.getDetails(
            {placeId: vm.concertValues.venueId},
            function(placeResult, serviceStatus) {
                vm.venueName = placeResult.name;
                vm.venueDetails = placeResult;
            }
        );
    }
      
    vm.populateSpringJam = function() {
        vm.selectedArtists = [];
        
        var artistPromise = ArtistService.search("Steve Aoki");
            artistPromise.then(function(artists) {
            vm.selectedArtists.push(artists[0]);
        });
        
        var rawDate = new Date("2016-05-21");
        //normalize the date and eliminate unwanted offset
        vm.concertDate = new Date(rawDate.getTime() + rawDate.getTimezoneOffset()*60000);
        
        vm.venueId = "ChIJKcBHSE7GxokR8DA8BOQt8w4";
        vm.venueName = "Drexel University, Chestnut Street, Philadelphia, PA, United States";
    }

    vm.videoDetails = function() {
      return function() {
        if (vm.venueDetails != null) {
            vm.venueId = vm.venueDetails.place_id;
        }
          
        return {
          'venueName'   : vm.venueName,
          'venueId'     : vm.venueId,
          'date'        : vm.concertDate,
          'artists'     : vm.selectedArtists
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
