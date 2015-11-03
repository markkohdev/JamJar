(function() {
  'use strict';

  angular
    .module('jamjar')
    .directive('jamjarUpload', jamjarUpload);

  /** @ngInject */
  function jamjarUpload() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/directives/upload/jamjar-upload.html',
      controller: jamjarUploadController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function jamjarUploadController(FileUploader, $http) {
      var vm = this;

      vm.uploadSettings = {
        url: 'http://api.localhost.dev:5001/videos/',
        removeAfterUpload: true,
        formData: [
          {
            'name': vm.filename
          }
        ]
      };

      vm.uploader = new FileUploader(vm.uploadSettings);

      // When the user updates the filename in the input, update the field in the uploader
      vm.updateFilename = function() {
        vm.uploadSettings.formData[0].name = vm.filename;
      };

    }
  }

})();
