(function () {
  'use strict';
  angular
      .module('jamjar')
      .controller('UploadController', UploadController);

  function UploadController (ArtistService, $scope) {
    var vm = this;

    var showUpload = false;
      
    function showUploadWidget(){
        showUpload = true;
    }
      
    function canShowUpload(){
        return showUpload;
    }
      
    vm.selectedItem = null;
    vm.searchText = null;
    vm.selectedArtists = [];
    vm.autocompleteRequireMatch = false;
    vm.searchResults = [];

    vm.concertVenue = null;
    vm.concertDate = null;

    vm.outstanding_artist_deferred = null;

    vm.artistSearch = function(query) {
      return ArtistService.search(query);
    }

    vm.concertVenueName = function() {
      return _.get(vm.concertVenue, 'name', null);
    }

    vm.canContinue = function() {
      return vm.selectedArtists.length > 0 && vm.concertVenue && vm.concertDate;
    }

    vm.videoDetails = function() {
      return function() {
        return {
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
