(function() {
  'use strict';

  angular
    .module('jamjar2')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
