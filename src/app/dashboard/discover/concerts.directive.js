(function() {
  'use strict';

  angular
    .module('jamjar')
    .directive('concerts', concerts);

  /** @ngInject */
  function concerts() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/dashboard/discover/concerts.html',
      controller: ConcertsController,
      controllerAs: 'concerts',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function ConcertsController(ConcertService) {
        var vm = this;

        vm.concerts = {};

        vm.concertArtists = function(concert) {
          return _.map(concert.artists, 'name').join(", ");
        };


        (function() {
          ConcertService.list(function(err, res) {
            if (err) { return alert('error')}

            vm.concerts = res;
            console.log(vm.concerts);
          });

        })();
    }
  }

})();
