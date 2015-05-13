/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        // document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        // app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');

        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        // console.log('Received Event: ' + id);
    }
};

//app.initialize();

var downloadApp = function() {
}

downloadApp.prototype = {
    run: function(uri, fileName, folderName) {
        var that = this,
            filePath = "";
        
        that.getFilesystem(
                function(fileSystem) {
                    console.log("gotFS");
                    
                    if (device.platform === "Android") {
                        that.getFolder(fileSystem, folderName, function(folder) {
                            filePath = folder.toURL() + "\/" + fileName;
                            that.transferFile(uri, filePath)
                        }, function() {
                            console.log("failed to get folder");
                        });
                    } else {
                        var filePath;
                        var urlPath = fileSystem.root.toURL();
                        if (device.platform == "Win32NT") {
                            urlPath = fileSystem.root.fullPath;
                        }
                        if (parseFloat(device.cordova) <= 3.2) {
                            filePath = urlPath.substring(urlPath.indexOf("/var")) + "\/" + fileName;
                        } else {
                            filePath = urlPath + "\/" + fileName;
                        }
                        that.transferFile(uri, filePath)
                    }
                },
                function() {
                    console.log("failed to get filesystem");
                }
            );
    },
    
    getFilesystem:function (success, fail) {
        window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, success, fail);
    },

    getFolder: function (fileSystem, folderName, success, fail) {
        fileSystem.root.getDirectory(folderName, {create: true, exclusive: false}, success, fail)
    },

    transferFile: function (uri, filePath) {
        var transfer = new FileTransfer();
        transfer.download(
            uri,
            filePath,
            function(entry) {
                var targetPath = entry.toURL();
                if (device.platform == "Win32NT") {
                    targetPath = entry.fullPath;
                }
                var image = document.getElementById("downloadedImage");
                image.src = targetPath;
                image.style.display = "block";
                image.display = targetPath;
                document.getElementById("result").innerHTML = "File saved to: " + targetPath;
                window.plugins.toast.show(targetPath + '에 저장 되었습니다', 'short', 'bottom', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
            },
            function(error) {
                document.getElementById("result").innerHTML = "An error has occurred: Code = " + error.code;
                console.log("download error source " + error.source);
                console.log("download error target " + error.target);
                console.log("upload error code" + error.code);
            }
            );
    },
}

function imgDownload(url){
    //window.open(url, '_blank', 'location=yes');
    window.plugins.toast.show('Image Saving...', 'short', 'bottom', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});

    if(device.platform=="iOS"){
        return imgDownloadIOS(url);
    }
    else {
        return imgDownloadAndroid(url);
    }
}


function imgDownloadAndroid(url) {
    var that = this,
    App = new downloadApp(),
    fileName = url.substring(url.lastIndexOf('/')+1),
    uri = encodeURI(url),
    folderName = "dwinguler";

    App.run(uri, fileName, folderName);
}

function imgDownloadIOS(url){
    /*var myCallbackMethod = function(returnVal) {
        console.log(returnVal);
    };

    window.plugins.saveImage.saveImageFromURL(url, 'myCallbackMethod');*/
    //document.addEventListener("deviceready",onDeviceReady);
    cordova.plugins.imgDownloader.downloadWithUrl(url,function(){
            
        },function(){
            alert("error");
        });    
    

}

//파라미터 받아오기
//ex : var mode=getParameter('mode');
var getParameter = function (param) {
	var returnValue;
	var url = location.toString(); 
	var parameters = (url.slice(url.indexOf('?') + 1, url.length)).split('&');
	for (var i = 0; i < parameters.length; i++) {
		var varName = parameters[i].split('=')[0];
		if (varName.toUpperCase() == param.toUpperCase()) {
			returnValue = parameters[i].split('=')[1];
			return decodeURIComponent(returnValue);
		}
	}
};

//서버주소
var server = 'http://ins0519.cafe24.com/';

function backKeyDown() {
    if (confirm('프로그램을 종료하시겠습니까?')) {
        navigator.app.exitApp();
    }
}
document.addEventListener("backbutton", backKeyDown, true);

function loadingShow(){
	$("#loadingBack").show();
	$("#loading").show();
}

function loadingHide(){
	$("#loadingBack").hide();
	$("#loading").hide();
}

function funLoad(){
	var Cheight = $(window).height() - 60 - 76;
	var Cheight2 = $(window).height() - 60;
	$('#menu').css({'height':Cheight+'px'});
	$('#menu2').css({'height':Cheight+'px'});
	$('#menu3').css({'height':Cheight2+'px'});
	$('#menu4').css({'height':Cheight2+'px'});
	$('#sensory').css({'height':Cheight+'px'});
	$('#general').css({'height':Cheight+'px'});
}
window.onload = funLoad;
window.onresize = funLoad;

//	$("#nav-menu").find("ul").find("li")
//		.mouseover(
//			function(){
//				$(this).find('.active').css('display','block');
//			})
//		.mouseout(
//			function(){
//				$(this).find('.active').css('display','none');
//			});


