(function () {
  'use strict';
  angular
      .module('jamjar')
      .controller('UploadController', UploadController);

  function UploadController ($timeout, $q) {
    var self = this;

    self.readonly = false;
    self.selectedItem = null;
    self.searchText = null;
    self.querySearch = querySearch;
    self.artists = loadArtists();
    self.selectedArtist = [];
    self.numberChips = [];
    self.numberChips2 = [];
    self.numberBuffer = '';
    self.autocompleteRequireMatch = true;
      
    self.transformChip = transformChip;
      
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
      
    /*Search for artists*/
    function querySearch (query) {
      var results = query ? self.artists.filter(createFilterFor(query)) : [];
      return results;
    }

    /*Create filter function for a query string*/
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(artist) {
        return (artist._lowername.indexOf(lowercaseQuery) === 0);
      };

    }

    function loadArtists() {
      var groups = [
        {
          'name': 'group1'
        },
        {
          'name': 'group2'
        },
        {
          'name': 'group3'
        },
        {
          'name': 'group4'
        },
        {
          'name': 'group5'
        }
      ];

      return groups.map(function (g) {
        g._lowername = g.name.toLowerCase();
        return g;
      });
    }
  }
})();