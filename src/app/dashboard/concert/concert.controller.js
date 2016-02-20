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
        vm.concert_graph = {};

        ConcertService.getConcertById(vm.concert_id, function(err, res) {
          if (err) {
            debugger
            return alert('error');
          }

          vm.concert = res;
        });

        ConcertService.getGraphById(vm.concert_id, function(err, res) {
          if (err) {
            debugger
            return alert('error');
          }

          vm.concert_graph = res;
        });

    }
})();
