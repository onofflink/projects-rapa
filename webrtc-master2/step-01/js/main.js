'use strict'; # 반드시 변수를 선언해야 한다.

// On this codelab, you will be streaming only video (video: true).
const mediaStreamConstraints = {
  video: true,
};

// Video element where stream will be placed.
const localVideo = document.querySelector('video');

// Local stream that will be reproduced on the video.
let localStream;

// Handles success by adding the MediaStream to the video element.
function gotLocalMediaStream(mediaStream) {
  // parameter is the streamving from the webcam
  localStream = mediaStream; // save for possible later use
  localVideo.srcObject = mediaStream;
}

// Handles error by logging a message to the console with the error message.
function handleLocalMediaStreamError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

// Initializes media stream.
navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
  .getUserMedia(mediaStreamConstraints) // 상수값 {video: true,};
  .then(gotLocalMediaStream).catch(handleLocalMediaStreamError)
  .catch(handleLocalMediaStreamError);
