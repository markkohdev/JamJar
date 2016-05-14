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

    vm.concertInput = null;
    vm.concertVenue = null;
    vm.concertDate = null;  
    
    vm.artistSearch = function(query) {
      return ArtistService.search(query);
    }
    
    if($stateParams.artists != null) {
        var artistArr = vm.concertValues.artists.split(', ');
        
        _.each(artistArr, function(artistStr) {
            console.log("artistStr: " + artistStr);
            var artist = ArtistService.search(artistStr);//[0];
            
            console.log("ARTIST: " + JSON.stringify(artist));
            vm.selectedArtists.push(artist);
        })
    }
    if($stateParams.date != null) {
        vm.concertInput = vm.concertValues.venue;
        //vm.concertVenue = vm.concertValues.venue;
    }
    if($stateParams.venue != null) {
        var rawDate = new Date(vm.concertValues.date);
        //normalize the date and eliminate unwanted offset
        vm.concertDate = new Date(rawDate.getTime() + rawDate.getTimezoneOffset()*60000)
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
