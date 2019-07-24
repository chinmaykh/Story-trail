// Login Controller
var myApp = angular.module('myApp');

myApp.controller('LoginController', function ($scope, $http, $interval, $location, $anchorScroll, fileUpload, $window) {
    console.log("Login Controller loaded.... ");

    localStorage.clear();

    $scope.submitting = function () {
        console.log("Username" + $scope.usrname);
        console.log("PAssword" + $scope.pword);


        var cred = {
            username: $scope.usrname,
            password: $scope.pword
        }

        $http.post(window.location.origin  +'/api/auth', cred)
            .then((res) => {
                // On success
                $scope.status = ""
                localStorage.setItem('user', JSON.stringify(res.data));
                location.replace('/#!/home')
            }, (res) => {
                // On failure
                $scope.status = 'Incorrect Password'

            })

    }



});
