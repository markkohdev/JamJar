angular.module "concertstitch"
  .controller "UploadController", ($timeout, toastr, FileUploader, $scope) ->
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

    $scope.uploader = new FileUploader(uploadSettings)

    console.log $scope.uploader

    return
