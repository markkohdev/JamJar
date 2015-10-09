angular.module "jamjar"
  .directive "jamjarUpload", () ->
    directive =
      restrict: 'E'
      bindToController: true
      controllerAs: 'vm'
      templateUrl: 'app/upload/upload.html'
      controller: ($timeout, toastr, FileUploader) ->
        vm = this
        # activate = ->
        #   getWebDevTec()
        #   $timeout (->
        #     vm.classAnimation = 'rubberBand'
        #     return
        #   ), 4000
        #   return

        # showToastr = ->
        #   toastr.info 'Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>'
        #   vm.classAnimation = ''
        #   return

        # getWebDevTec = ->
        #   vm.awesomeThings = webDevTec.getTec()
        #   angular.forEach vm.awesomeThings, (awesomeThing) ->
        #     awesomeThing.rank = Math.random()
        #     return
        #   return
        uploadSettings =
          url: 'upload.php'
          removeAfterUpload: true

        vm.uploader = new FileUploader(uploadSettings)

        vm.uploader.onWhenAddingFileFailed = (item, filter, options) ->
          console.info('onWhenAddingFileFailed', item, filter, options)

        vm.uploader.onCompleteItem = (fileItem, response, status, headers) ->
          console.info('onCompleteItem', fileItem, response, status, headers)

        vm.uploader.onCompleteAll = () ->
          console.info('onCompleteAll')

        vm.uploader.onErrorItem = (item, response, status, headers) ->
          console.info(item)

        vm.waiting = (item) ->
          if item.progress < 100 || item.isError
            return true
          return false

        return vm
