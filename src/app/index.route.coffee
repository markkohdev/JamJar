angular.module "jamjar"
  .config ($stateProvider, $urlRouterProvider, $locationProvider) ->
    $stateProvider
      .state "home",
        url: "/"
        templateUrl: "app/main/main.html"
        controller: "MainController"
        controllerAs: "main"
      .state "uploadscript",
        url: "/uploadscript"
        templateUrl: "app/upload.php"

    $urlRouterProvider.otherwise '/'

    # use the HTML5 History API
    $locationProvider.html5Mode(true)
