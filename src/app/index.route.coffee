angular.module "concertstitch"
  .config ($stateProvider, $urlRouterProvider, $locationProvider) ->
    $stateProvider
      .state "home",
        url: "/"
        templateUrl: "app/main/main.html"
        controller: "MainController"
        controllerAs: "main"
      .state "upload",
        url: "/upload"
        templateUrl: "app/upload/upload.html"
        controller: "UploadController"
        controllerAs: "upload"
      .state "uploadscript",
        url: "/uploadscript"
        templateUrl: "app/upload.php"

    $urlRouterProvider.otherwise '/'

    # use the HTML5 History API
    $locationProvider.html5Mode(true)
