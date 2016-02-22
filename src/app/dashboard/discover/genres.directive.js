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
      controllerAs: 'genres',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function GenresController(AuthService, $state) {
        var vm = this;

        vm.types = [
            {
              state: 'dashboard.discover',
              name: 'R&#38;B'
            },
            {
              state: 'dashboard.discover',
              name: 'Pop'
            },
            {
              state: 'dashboard.discover',
              name: 'Folk'
            },
            {
              state: 'dashboard.discover',
              name: 'Country'
            },
            {
              state: 'dashboard.discover',
              name: 'Rock'
            },
            {
              state: 'dashboard.discover',
              name: 'Blues'
            },
                        {
              state: 'dashboard.discover',
              name: 'Classical'
            },
            {
              state: 'dashboard.discover',
              name: 'Alternative'
            }
        ];
    }
  }

})();
