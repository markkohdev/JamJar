(function() {
  'use strict';

  angular
    .module('jamjar')
    .directive('jamjarUpload', jamjarUpload);

  /** @ngInject */
  function jamjarUpload() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/upload/upload.html',
      controller: jamjarUploadController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function jamjarUploadController(FileUploader) {
      var vm = this;

      var uploadSettings = {
        url: 'upload.php',
        removeAfterUpload: true
      };

      vm.uploader = new FileUploader(uploadSettings);
    }
  }

})();
