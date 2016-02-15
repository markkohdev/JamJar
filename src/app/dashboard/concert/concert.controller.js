(function() {
    'use strict';
    angular
        .module('jamjar')
        .controller('ConcertController', ConcertController);

    /** @ngInject */
    function ConcertController(ConcertService, $state) {
        var vm = this;

        vm.concert_id = $state.params.id;
        vm.concert = {};

        ConcertService.getConcertById(vm.concert_id, function(err, res) {
          if (err) {
            debugger
          }

          vm.concert = res;
        });
    }
})();
