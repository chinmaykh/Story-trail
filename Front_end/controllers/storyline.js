
// Storyline Controller
var myApp = angular.module('myApp');

// File upload service
myApp.service('fileUploadC', ['$http', function ($http) {

    // Custom function
    this.uploadFileToUrl = function (file, uploadUrl) {

        // Make a new form and add file to it
        var fd = new FormData();
        fd.append('file', file);

        // Make the post request
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).then(function mySuccess(response) {

            // When it finishes update the Story object
            user = JSON.parse(localStorage.getItem('user'))

            //Template
            var entry = {
                "author_name": user.username,
                "author_id": user._id,
                "entry": localStorage.getItem('earners'),
                "date": toString(new Date()),
                "audio": {
                    present: true,
                    audId: '/files/' + response.data.fileUploadId
                }
            }

            // Update localObject
            story.entries.push(entry);

            // Update on DB
            $http.post(window.location.origin + '/api/update/story', story)
                .then((req) => {
                    resetText();
                    window.scrollBy(0, 100000);
                })
                .catch((req) => {
                    console.log('Now what happend ?')
                })

        }, function myError(response) {
            console.log(response.data);
        });
    }

}]);


myApp.controller('StrylineController', function ($scope, $http, $interval, $location, $anchorScroll, fileUploadC, $window) {
    console.log("Storyline Controller loaded.... ");

    // Initialize the input
    $scope.insta_para = ''

    // initialize the Blob
    var superBuffer;

    // The audio file
    var audioFile;

    // Socket.io for preventing parallel connection
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
        } else if (data == 'Authorized') {
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


    // Assign user mail
    document.getElementById('user_mail').innerText = JSON.parse(localStorage.getItem('user')).username

    // Redirect to login if not signed in
    if (!localStorage.getItem('user')) {
        M.toast({ html: 'Sign In first !!' })
        location.replace('/#!/login')
    }

    // The User Object
    var user = JSON.parse(localStorage.getItem('user'))

    // Story being selected
    var tid = JSON.parse(localStorage.getItem('edit_story'))._id

    // Get All details of story
    $http.post(window.location.origin + '/api/get/story',
        { _id: tid }
    ).then((res) => {
        $scope.story = res.data;
        story = res.data;
    }, (res) => {
        alert(res)
    })


    // Adding entry to story
    /*
    First we have to validate ( because form validation isn't supported )
    */
    $scope.addPart = function () {

        if (document.getElementById('player').src == "") {
            $scope.include = false;
        }

        if ($scope.insta_para != "") {
            if ($scope.include) {

                audioFile = new File([superBuffer], "Audio_file.mp4")
                localStorage.setItem('earners', $scope.insta_para);
                fileUploadC.uploadFileToUrl(audioFile, '/upload/')
                $scope.insta_para = ""
                $scope.include = 0 ;
            } else {
                //Template
                var entry = {
                    "author_name": user.username,
                    "author_id": user._id,
                    "entry": $scope.insta_para,
                    "date": toString(new Date()),
                    "audio": {
                        present: $scope.include
                    }
                }

                // Update localObject
                story.entries.push(entry);

                // Update on DB
                $http.post(window.location.origin + '/api/update/story', story)
                    .then((req) => {
                        $scope.insta_para = ""
                        window.scrollBy(0, 100000);
                    })
                    .catch((req) => {
                        console.log('Now what happend ?')
                    })

            }
        }


    }

    // Audio Acquiring Unit ( AAU )

    // Chunks of data from mic
    var recordedChunks = [];

    // Options
    var options = { mimeType: 'audio/webm' };

    // The player
    var audio = document.getElementById('player');

    // Initially hidden.
    audio.style.height = 40;

    // Recorder Called
    $scope.recordIt = function () {
        // Get the media !
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then((stream) => {
                // On successfully getting the data stream. Log it.
                console.log('Stream Obtained')

                // Create a new mediaRecorder
                mediaRecorder = new MediaRecorder(stream, options);

                // Start Saving the data and log the state, notify user
                mediaRecorder.start();
                console.log(mediaRecorder.state);
                $scope.recordState = 'Recording...'


                // What to do when the data comes in.. Push it into the array
                mediaRecorder.ondataavailable = function (event) {
                    recordedChunks.push(event.data);
                }

                // When user clicks stop
                document.getElementById('Stop').addEventListener('click', (ev) => {
                    // Stop Recording and Log it. Notify user
                    mediaRecorder.stop();
                    console.log(mediaRecorder.state);
                    $scope.recordState = 'Recorded ! Click on the mic icon to discard and record a new audio clip. Click on the audio options to download the current file.'

                });

                mediaRecorder.onstop = (event) => {
                    superBuffer = new Blob(recordedChunks, { type: 'audio/mp4' });
                    recordedChunks = []
                    let audioUrl = window.URL.createObjectURL(superBuffer);
                    audio.src = audioUrl;
                }
            }).catch((err) => {
                console.error(err);
            });
    }

    $scope.check = function () {
        if (document.getElementById('player').src == "") {
            $scope.include = false;
        }
    }

    var ele = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(ele, {});


});

