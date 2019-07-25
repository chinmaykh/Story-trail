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

        $http.post(window.location.origin + '/api/auth', cred)
            .then((res) => {
                // On success
                if (res.data == "INP") {
                    $scope.status == 'Incorrect Password'
                } else if (res.data == 'EAP') {
                    console.log('hhhh')
                    M.toast({html:'Verify your email'})
                    $scope.status == 'Verify your email by clicking on the link we have sent to your mail'
                } else if (res.data == 'EAP First time') {
                    $scope.status == 'Verify your email'
                    M.toast({html:'Verify your email'})
                } else {
                    $scope.status = ""
                    localStorage.setItem('user', JSON.stringify(res.data));
                    location.replace('/#!/home')
                }

            }, (res) => {
                // On failure
                M.toast({ html: 'The server seems to have some error.. try again later or contact admin (contat in sidenav0' })
            })

    }



});
