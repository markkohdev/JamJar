angular.module "jamjar"
  .config ($stateProvider, $urlRouterProvider, $locationProvider) ->
    $stateProvider
      .state "home",
        url: "/"
        templateUrl: "app/main/main.html"
        controller: "MainController"
        controllerAs: "vm"
        bindToController: true
      .state "uploadscript",
        url: "/uploadscript"
        templateUrl: "app/upload.php"

    $urlRouterProvider.otherwise '/'

    # use the HTML5 History API
    # $locationProvider.html5Mode(true)
