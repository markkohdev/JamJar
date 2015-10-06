angular.module "jamjar"
  .controller "MainController", () ->
    vm = this

    vm.selected = 0
    console.log vm.selected

    return
