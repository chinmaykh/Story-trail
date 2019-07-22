//Invites Controller
var myApp = angular.module('myApp');

myApp.controller('InvitesController', function ($scope, $http, $interval, $location, $anchorScroll, fileUpload, $window) {
    console.log("Invites Controller loaded.... ");

    if (!localStorage.getItem('user')) {
        M.toast({ html: 'Sign In first !!' })
        location.replace('/#!/login')
    }


    // Refresh the list of invites
    $http.post('http://192.168.0.109:2019/api/auth', {
        username: JSON.parse(localStorage.getItem('user')).username,
        password: JSON.parse(localStorage.getItem('user')).password
    }).then((res) => {
        localStorage.setItem('user', JSON.stringify(res.data));
        getAllInvites()
    }, (res) => { M.toast({ html: 'Something seems to be wrong' }) });


    // Define invites list
    $scope.invites = [];

    function getAllInvites() {

        // Get all invites

        user = JSON.parse(localStorage.getItem('user'))


        if (user.invites.length != 0) {
            user.invites.forEach(element => {
                console.log(element)
                $http.post('http://192.168.0.109:2019/api/name/story', { "_id": element })
                    .then((res) => {
                        $scope.invites.push(res.data);
                    }, (res) => {
                        console.log(res)
                    })
            });
        }
    }

    // Add to Library
    $scope.addToLibrary = function (index) {

        console.log('Adding to Library')

        user = JSON.parse(localStorage.getItem('user'))
        var temp_user = user;
        console.log(temp_user.invites)
        temp_user.story_list.push({ _id: user.invites[index] });
        temp_user.invites.splice(index, 1);
        $http.post('http://192.168.0.109:2019/api/update/user', temp_user)
            .then((res) => {
                localStorage.setItem('user', JSON.stringify(temp_user));
                $scope.invites.splice(index, 1);
            }, (res) => {
                M.toast({
                    html: 'Something seems to be wrong'
                })
            });
    }

});
