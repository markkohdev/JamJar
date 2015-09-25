angular.module "concertstitch"
  .config ($stateProvider, $urlRouterProvider) ->
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

    $urlRouterProvider.otherwise '/'
