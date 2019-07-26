// Storyline Controller
var myApp = angular.module('myApp');

myApp.controller('StrylineController', function ($scope, $http, $interval, $location, $anchorScroll, fileUpload, $window) {
    console.log("Storyline Controller loaded.... ");

    $scope.insta_para = ''

    const socket = io.connect();
    socket.emit('blockEdit',
        {
            'story': JSON.parse(localStorage.getItem('edit_story'))._id,
            'user': JSON.parse(localStorage.getItem('user'))._id
        }
    );

    socket.on(JSON.parse(localStorage.getItem('user'))._id, (data) => {
        if (data == 'Unauthorized') {
            document.getElementById('textarea1').disabled = true;
            $scope.editText = "Someone else is editing at the moment.. You will be notified when it you can edit."
        }else if(data =='Authorized'){
            document.getElementById('textarea1').disabled = false;
            $scope.insta_para.disabled = false;
            $scope.editText = ""
        }
    })

    socket.on('freedOne', (data) => {

        console.log('Freed One ')
        var flag = 0;

        for (let index = 0; index < data.length; index++) {
            if (data[index].storyData.story == JSON.parse(localStorage.getItem('edit_story')._id)) {
                flag = 1;
                break;
            }
        }


        if (flag == 0) {
            socket.emit('blockEdit',
                {
                    'story': JSON.parse(localStorage.getItem('edit_story'))._id,
                    'user': JSON.parse(localStorage.getItem('user'))._id

                })
        }
    })


    document.getElementById('user_mail').innerText = JSON.parse(localStorage.getItem('user')).username


    if (!localStorage.getItem('user')) {
        M.toast({ html: 'Sign In first !!' })
        location.replace('/#!/login')
    }

    var user = JSON.parse(localStorage.getItem('user'))
    var tid = JSON.parse(localStorage.getItem('edit_story'))._id
    console.log(tid)

    $http.post(window.location.origin + '/api/get/story',
        { _id: tid }
    ).then((res) => {
        $scope.story = res.data;
        story = res.data;
    }, (res) => {
        alert(res)
    })


    $scope.addPart = function () {
        var entry = {
            "author_name": user.username,
            "author_id": user._id,
            "entry": $scope.insta_para,
            "date": toString(new Date())
        }



        story.entries.push(entry);

        $http.post(window.location.origin + '/api/update/story', story)
            .then(
                (req) => {
                    $scope.insta_para = ""
                    window.scrollBy(0, 100000);
                }, (req) => {
                    console.log('Now what happend ?')
                })


    }


});

document.addEventListener('DOMContentLoaded', () => {
    var ele = document.querySelectorAll('.tooltipped');
    var instanc = M.Tooltip.init(ele, {});
    console.log('ihihiu')
})
