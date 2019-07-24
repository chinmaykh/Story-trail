// Share Controller
var myApp = angular.module('myApp');

myApp.controller('ShareController', function ($scope, $http, $interval, $location, $anchorScroll, fileUpload, $window) {
    console.log("Share Controller loaded.... ");

    
if(!localStorage.getItem('user')){
    M.toast({html:'Sign In first !!'})
    location.replace('/#!/login')
  }

    var user = JSON.parse(localStorage.getItem('user'))
    var shareId = JSON.parse(localStorage.getItem('edit_story'));

    $scope.share_destination =shareId.heading


    $http.get(window.location.origin + '/api/list/name/users')
        .then((res) => {
            console.log(res)
            $scope.names = res.data

        }, (res) => {
            console.log(res)
        })


    shareList = []

    $scope.addToList = function () {

        var temp = $scope.share_user
        if ((!shareList.includes(temp)) && $scope.names.includes(temp) && temp!=user.username) {
            shareList.push(temp);
        } else{
            M.toast({html: 'Invalid Entry !'})
        }
        $scope.share_user = ""
        console.log(shareList)
        $scope.jkl = shareList
    }


    $scope.shareIt = function () {
        console.log('called')
        shareList.forEach(element => {

            var body = {
                "story": shareId,
                "uid": element
            }

            $http.post(window.location.origin + '/api/invite/user', body)
                .then((res) => {
                    M.toast({html: 'Shared Successfully !'})
                }, (res) => {
                    console.log(res)
                    M.toast({html: 'Som error occured ! Notify developer if problem persists'})
                });

        })

        location.replace('/#!/home')
    }
    
});
