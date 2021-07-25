let videoElem = document.querySelector("video");
// 1. 
let recordBtn = document.querySelector(".record");
let captureImgBtn = document.querySelector(".click-image")
let filterArr = document.querySelectorAll(".filter");
let filterOverlay = document.querySelector(".filter_overlay");
let newStream;
let isRecording = false;

// user  requirement send 
let constraint = {
    audio: true, video: true
}
// represent future recording
let recording = [];
let mediarecordingObjectForCurrStream;
// promise 
let usermediaPromise = navigator
    .mediaDevices.getUserMedia(constraint);
// /stream coming from required
usermediaPromise.
    then(function (stream) {
        // UI stream  putting stream in video element src
        videoElem.srcObject = stream;
       
        // creating mediaRecorder objectby passing our video stream to record

        mediarecordingObjectForCurrStream = new MediaRecorder(stream);
        // camera recording add -> recording video and stores it in  array.it runs when click o
        mediarecordingObjectForCurrStream.ondataavailable = function (e) {

            recording.push(e.data);
        }
        // download when we click on stop button
        mediarecordingObjectForCurrStream.addEventListener("stop", function () {
            // recording -> url convert 
            // type -> MIME type (extension)
            //creating blob object and putting type:video/,mp4 and putting recording array which we want to download
            const blob = new Blob(recording, { type: 'video/mp4' });
            
            const url = window.URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.download = "file.mp4";
            a.href = url;
            a.click();
            recording = [];
        })

    }).catch(function (err) {
        console.log(err)
        alert("please allow both microphone and camera");
    });

recordBtn.addEventListener("click", function () {
    //if mediarecording stream object is empty
    if (mediarecordingObjectForCurrStream == undefined) {
        alert("First select the devices");
        return;
    }
    if (isRecording == false) {
        //start recording
        mediarecordingObjectForCurrStream.start();
        // recordBtn.innerText = "Recording....";
        recordBtn.classList.add("record-animation");
        startTimer();
    }
    else {
        stopTimer();
        //stop recording
        mediarecordingObjectForCurrStream.stop();
        // recordBtn.innerText = "Record";
        recordBtn.classList.remove("record-animation");
    }
    isRecording = !isRecording
})
captureImgBtn.addEventListener("click", function () {
    // canvas create 
    let canvas = document.createElement("canvas");
    canvas.height = videoElem.videoHeight;
    canvas.width = videoElem.videoWidth;
    let tool = canvas.getContext("2d");
    // scaling
    // top left corner
    tool.scale(scaleLevel, scaleLevel);
    const x = (tool.canvas.width / scaleLevel - videoElem.videoWidth) / 2;
    const y = (tool.canvas.height / scaleLevel - videoElem.videoHeight) / 2;
    // console.log(x, y);
    tool.drawImage(videoElem, x, y);
    if (filterColor) {
        tool.fillStyle = filterColor;
        tool.fillRect(0, 0, canvas.width, canvas.height);
    }

    let url = canvas.toDataURL();
    let a = document.createElement("a");
    a.download = "file.png";
    a.href = url;
    a.click();
    a.remove();
    // videoELement
})
// filter Array
for (let i = 0; i < filterArr.length; i++) {
    filterArr[i].addEventListener("click", function () {
        filterColor = filterArr[i].style.backgroundColor;
        filterOverlay.style.backgroundColor = filterColor;
    })
}

