// Groups Controller
var myApp = angular.module('myApp');

var activeGrp;


myApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);


myApp.service('fileUpload', ['$http', function ($http) {

    this.uploadFileToUrl = function (file, uploadUrl, chatnam, user, myName) {
        var fd = new FormData();
        fd.append('file', file);
        fd.append('class', chatnam);
        fd.append('usrnam', user);
        fd.append('org', myName)
        console.log(fd);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).then(function mySuccess(response) {
            console.log(response.data);

            activeGrp.messages.push(
                {
                    "entry":"File uploaded by " + localStorage.getItem("Name") + " to access , go to http://localhost:8989/files/" +  response.data.fileUploadId,
                    "user": localStorage.getItem("Name")
                }
            )
            
        $http({
            method: "POST",
            url: "/api/class/",
            data: activeGrp 
        }).then((result) => {
            // What do i do with the result ?
            console.log("Successfully transacted the message ....");
        }, (result) => {
            alert("Some error geting messages");
        })


            myApp.controller('GroupController').$scope.dynamicize(activeGrp.name);
            // document.getElementById('fl').style.display = "none";
            // document.getElementById('fs').style.display = "block";
            // console.log(response);
         }, function myError(response) {
            console.log(response.data);                 
        //     console.log(response);
        //     document.getElementById('fl').style.display = "block";
        //     document.getElementById('fs').style.display = "none";
        });
    }

}]);



myApp.controller('GroupController', function ($scope, $http, $interval, $location, $anchorScroll,fileUpload, $window) {
    console.log("Group Controller loaded.... ");
    console.log($window.innerWidth);
    
    /* How this works
        First, by the ID of the user, all the group(class) names are called.
        On Clicking on any of the classes from the list, the messages panel will 
        then do the network call for the class object.
        The incoming data is stored and is cast to the scope variable holding the viewable messages.
    0    While present in the chat screen, the network call is repeatedly done to ensure updates.
        (
            TODO: To check for latest changes make a seperate call to the server which looks for changes
            and if confirmation sends the updated class object
        )
        The data which is cast through the scope variable will also have an additional parameter for
        message sender, this will be analysed for appropriate displays ( color coding is good enough)
    */

    $scope.grplist = [];
    $scope.myStyle = { height: window.innerHeight, padding: "0%" };
    $scope.msgCol = { height: window.innerHeight, padding: "0%" }
    console.log($scope.myStyle);
    $scope.messages = [];



  
    
    // Dynamic data adaption system 



    for (let index = 0; index < 500; index++) {
        $scope.messages[index] = index;
    }
    // Network call for groups

    $scope.grplist = JSON.parse(localStorage.getItem('groups'));
    console.log($scope.grplist);

    $scope.getChats = function (chatName) {

    }

    $scope.adjustHeight = function () {
    }

    $scope.dynamicize = function(grp) {
        $scope.dynamic = {
            "head": grp
        }

        $http({
            method: "GET",
            url: "/api/class/" + grp
        }).then((result) => {
            $scope.dynamic.msg = result.data[0].messages;
            $scope.msgHead = grp;
            $scope.dynamic.msg.forEach(element => {
                if (element.user == localStorage.getItem("Name")) {
                    element.color = "white";
                    element.align = "right"
                }
                else {
                    element.color = "white";
                    element.align = "left";
                }
            });

            activeGrp = result.data[0];
            console.log("This is where it is assigned" + JSON.stringify(activeGrp));
            console.log($scope.dynamic);
            console.log(result.data[0]);
            $location.hash('end');
            
            $interval(function startPing(){$scope.dynamicize(activeGrp.name);
$interval.cancel(); 
},100000000);
$anchorScroll;
document.getElementById("end").scrollTop = 999999999999999999999999999;
        }, (result) => {
            alert("Some error geting messages");
        })
    
        
    }

    $scope.sendMessage = function () {
        var buffer = {
            "entry": $scope.msgInput,
            "user": localStorage.getItem("Name")
        }

        activeGrp.messages.push(buffer);

        $http({
            method: "POST",
            url: "/api/class/",
            data: activeGrp
        }).then((result) => {
            // What do i do with the result ?
            console.log("Successfully transacted the message ....");
        }, (result) => {
            alert("Some error geting messages");
        })

        $scope.dynamicize(activeGrp.name);
        $scope.msgInput = "";
    }

    $scope.checkEnter = function (event) {
        if (event.keyCode == 13) {
            $scope.sendMessage();
        }
    }


    
    $scope.uploadFile = function () {
        var file = $scope.IMAGE;
        console.log('file is ');
        console.dir(file);
        var chatnam = document.getElementById("something").innerHTML;
        console.log("The Chat Name is " + chatnam);
        var usr = localStorage.getItem('Name');
        console.log("The user sending it is " + usr);
        var myName = $scope.place;
        console.log("The file name given is" + myName);
        var uploadUrl = "/upload/";
         fileUpload.uploadFileToUrl(file, uploadUrl, chatnam, usr, myName);   
};

$interval( ()=>{
    $location.hash('end');
    $anchorScroll;
    console.log("SCSCSCSCSCSCSC")
}, 200);

$scope.mobileDynamic = function (grpName) {
    
    $http({
        method: "GET",
        url: "/api/class/" + grpName
    }).then((result) => {
        console.log(result.data[0].messages);
        $scope.mobile_msg = result.data[0].messages;
    }, (result)=>{
        console.log(result.data[0].messages);
    });
}

$scope.mobile_input = { position :"absolute", margin:0, "bottom" : "0%", color:"black","background-color":"white", bottom:0};
$scope.mobile_container = { position : "relative" , "overflow-y" : "scroll", 'height':'85vh', 'padding-bottom':'1vh' }
$scope.parentOfMsg = {  "overflow-y" : "scroll" }
$scope.mobileDynamic("chin &kiran");
$scope.desktop_height = { height :  screen.availHeights };

});
