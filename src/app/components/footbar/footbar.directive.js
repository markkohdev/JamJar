(function() {
  'use strict';

  angular
    .module('jamjar')
    .directive('footbar', footbar);

  /** @ngInject */
  function footbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/footbar/footbar.html',
      controller: FootbarController,
      controllerAs: 'footbarCtrl',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function FootbarController() {
      this.pages = [
        {
          state: 'aboutUs',
          name: 'About Us'
        },
        {
          state: 'support',
          name: 'Support'
        },
        {
          state: 'ourTeam',
          name: 'Our Team'
        },
        {
          state: 'blog',
          name: 'Blog'
        },
        {
          state: 'legal',
          name: 'Legal'
        },
        {
          state: 'privacy',
          name: 'Privacy'
        }
      ];
    }
  }

})();
