(function() {
  'use strict';

  angular
    .module('jamjar')
    .directive('genres', genres);

  /** @ngInject */
  function genres() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/dashboard/discover/genres.html',
      controller: GenresController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function GenresController(GenreService) {
      var vm = this;

      vm.genres = [];
      vm.colors = ["#FDEB65", "#F5A95F", "#F15F4E", "#9BD096", "#7976B4", "#673A96"];

      GenreService.list(function(err, resp) {
        if (err) {
          return console.error(err);
        }

        vm.genres = resp;
        console.log(resp);
      });
    }
  }

})();
