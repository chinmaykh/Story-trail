// Home List Controller
var myApp = angular.module('myApp');

myApp.controller('HomeController', function ($scope, $http, $interval, $location, $anchorScroll, fileUpload, $window) {
    console.log("Home Controller loaded.... ");

    
if(!localStorage.getItem('user')){
    M.toast({html:'Sign In first !!'})
    location.replace('/#!/login')
  }

    var user = JSON.parse(localStorage.getItem('user'))

    $scope.books = []

    $scope.helper = "";

    user.story_list.forEach(element => {
        $http.post('http://192.168.0.109:2019/api/name/story', element)
            .then((res) => {
                console.log(res)
                $scope.books.push(res.data);
            }, (res) => {
                console.log(res)
            })
    });
    

    $scope.addBook = function () {

        $http.post('http://192.168.0.109:2019/api/story',
            {
                "heading": $scope.title,
                "entries": [
                    {
                        "author_name": user.username,
                        "author_id": user._id,
                        "entry": $scope.intro,
                        "date": toString(new Date())
                    }
                ],
                "admins": [
                    user._id
                ]
            }
        )
            .then((res) => {
                console.log(res)
                user.story_list.push({ _id: res.data._id });
                localStorage.setItem('user', JSON.stringify(user))

                $http.post('http://192.168.0.109:2019/api/update/user',user).then(
                    (res)=>{
                        M.toast({html:'Successfully started the trail'})
                        location.replace('/#!/home')
                    },
                    (res)=>{
                        console.log(res)
                    }
                )
     

            }, (res) => {
                console.log(res)
            })

   }



    $scope.nav_type = function (book) {
        localStorage.setItem('edit_story', JSON.stringify(book));
        location.replace('/#!/storyline')
    }

    $scope.nav_new_story = function () {
        location.replace('/#!/new');
    }

});
