// Home List Controller
var myApp = angular.module('myApp');

myApp.controller('LoadingController', function ($scope, $http, $interval, $location, $anchorScroll,fileUpload, $window) {
    console.log("Loading Controller loaded.... ");

    document.getElementById('user_mail').innerText = JSON.parse(localStorage.getItem('user')).username


    if(!localStorage.getItem('user')){
        M.toast({html:'Sign In first !!'})
        location.replace('/#!/login')
      }

    $scope.books=[
        {
            "heading":"First",
            "des":"shjghjgfjgjdgfjgwkefhgwgf"
        },{
            "heading":"Fit",
            "des":"shjghjgfjgjdgfjgwkefhgwgf"

        },{
            "heading":"Fi",
            "des":"shjghjgfjgjdgfjgwkefhgwgf"

        },{
            "heading":"t",
            "des":"shjghjgfjgjdgfjgwkefhgwgf"

        },{
            "heading":"t",
            "des":"shjghjgfjgjdgfjgwkefhgwgf"

        },{
            "heading":"t",
            "des":"shjghjgfjgjdgfjgwkefhgwgf"

        },{
            "heading":"t",
            "des":"shjghjgfjgjdgfjgwkefhgwgf"

        },{
            "heading":"t",
            "des":"shjghjgfjgjdgfjgwkefhgwgf"

        },{
            "heading":"t",
            "des":"shjghjgfjgjdgfjgwkefhgwgf"

        },{
            "heading":"t",
            "des":"shjghjgfjgjdgfjgwkefhgwgf"

        },{
            "heading":"t",
            "des":"shjghjgfjgjdgfjgwkefhgwgf"

        },{
            "heading":"t",
            "des":"shjghjgfjgjdgfjgwkefhgwgf"

        },{
            "heading":"t",
            "des":"shjghjgfjgjdgfjgwkefhgwgf"

        },{
            "heading":"t",
            "des":"shjghjgfjgjdgfjgwkefhgwgf"

        },{
            "heading":"t",
            "des":"shjghjgfjgjdgfjgwkefhgwgf"

        },{
            "heading":"t",
            "des":"shjghjgfjgjdgfjgwkefhgwgf"

        }
    ]
});
