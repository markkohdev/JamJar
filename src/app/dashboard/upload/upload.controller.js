(function () {
  'use strict';
  angular
      .module('jamjar')
      .controller('UploadController', UploadController);

  function UploadController (ArtistService, $q) {
    var self = this;

    var showUpload = false;
      
    function showUploadWidget(){
        showUpload = true;
    }
      
    function canShowUpload(){
        return showUpload;
    }
      
    self.selectedItem = null;
    self.searchText = null;
    self.selectedArtists = [];
    self.autocompleteRequireMatch = false;

    // populated by responses from the API
    self.searchResults = [];
    self.transformChip = transformChip;

    self.artistSearch = function(query) {
      return ArtistService.search(query);
    }

    /* Return the proper object when the append is called*/
    function transformChip(chip) {
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
