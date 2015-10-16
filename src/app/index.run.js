(function() {
  'use strict';

  angular
    .module('jamjar')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
