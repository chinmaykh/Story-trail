var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function ($routeProvider) {
  $routeProvider
    .when('/login', {})
    .when('/login', {
      controller: 'LoginController', // Controller name ( declaration )
      templateUrl: 'views/login.html' // Viewto be embedded in index.html
    })
    .when('/home', {
      controller: 'HomeController', // Controller name ( declaration )
      templateUrl: 'views/list.html' // Viewto be embedded in index.html
    })
    .when('/storyline', {
      controller: 'StrylineController', // Controller name ( declaration )
      templateUrl: 'views/storyline.html' // Viewto be embedded in index.html
    })
    .when('/loading',{
      controller:'LoadingController',
      templateUrl:'views/loading.html'
    })
    .when('/login',{
      controller:'LoginController',
      templateUrl:'views/login.html'
    })
    .when('/new',{
      controller:'HomeController',
      templateUrl:'views/new_story.html'
    })
    .when('/share',{
      controller:'ShareController',
      templateUrl:'views/share.html'
    })
    .when('/invites',{
      controller:'InvitesController',
      templateUrl:'views/invites.html'
    })
    .when('/audio',{
      controller:'AudioController',
      templateUrl:'views/audio_record.html'
    })

    /*
    .when('/urlextension', {
        controller:'CntrlName'
        templateUrl:'views/filename.html'
    })
    */
    .otherwise({
      redirectTo: '/home'
    })
})

if(!localStorage.getItem('user')){
  M.toast({html:'Sign In first !!'})
  location.replace('/#!/login')
}