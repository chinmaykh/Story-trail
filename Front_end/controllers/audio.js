// Audio Controller
var myApp = angular.module('myApp');


myApp.service('fileUpload', ['$http', function ($http) {

    this.uploadFileToUrl = function (file, uploadUrl) {
        var fd = new FormData();
        fd.append('file', file);
        console.log(fd);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).then(function mySuccess(response) {
            console.log(response.data);
            $scope.msgServer = response.data;
         }, function myError(response) {
            console.log(response.data);                 
            $scope.msgServer = response.data;
        });
    }

}]);

myApp.controller('AudioController', function ($scope, $http, $interval, $location, $anchorScroll, fileUpload, $window) {
    console.log("Audio Controller loaded.... ");

    var recordedChunks = [];
    var superBuffer;
    var options = { mimeType: 'audio/webm' };

    var audio = document.getElementById('audio');
    var downloadLink = document.getElementById('download')


    $scope.recordIt = function () {
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then((stream) => {

                console.log('Stream Obtained')

                mediaRecorder = new MediaRecorder(stream, options);

                document.getElementById('Start').addEventListener('click', (ev) => {
                    mediaRecorder.start();
                    console.log(mediaRecorder.state)
                })

                mediaRecorder.ondataavailable = function (event) {
                    recordedChunks.push(event.data);
                }

                document.getElementById('Stop').addEventListener('click', (ev) => {
                    mediaRecorder.stop();
                    console.log(mediaRecorder.state);
                });

                mediaRecorder.onstop = (event) => {
                    superBuffer = new Blob(recordedChunks, {type:'audio/mp4'});
                    recordedChunks = []
                    let audioUrl = window.URL.createObjectURL(superBuffer);
                    audio.src = audioUrl;
                }
            }).catch((err) => {
                console.error(err);
            });
    }


    $scope.upload = (ev)=>{
        console.log('Uploading to server')

        var audioFile = new File([superBuffer],"Audio Recording.mp4")

        console.log(audioFile)


         fileUpload.uploadFileToUrl(audioFile,'/upload/');
    }

});
