'use strict';

/****************************************************************************
* Initial setup
****************************************************************************/

// var configuration = {
//   'iceServers': [{
//     'urls': 'stun:stun.l.google.com:19302'
//   }]
// };


var configuration = null;

// var roomURL = document.getElementById('url');
//html 에 있는 객체에 대한 참조를 가져온다. 
var video = document.querySelector('video'); //비디오 
var photo = document.getElementById('photo'); //사진 
var photoContext = photo.getContext('2d');  // context means board with other necessary details such as color etc. 

var snapBtn = document.getElementById('snap');
var sendBtn = document.getElementById('send');


var photoContextW;
var photoContextH;

// 버튼에 이벤트 핸들러를 붙인다.  
snapBtn.addEventListener('click', snapPhoto); //캡처 
//ajax
sendBtn.addEventListener('click', sendPhoto); //서버로 사진을 보낸다
 
// Disable send buttons by default.
sendBtn.disabled = false;


/****************************************************************************
* User media (webcam)
****************************************************************************/
function grabWebCamVideo() {
  console.log('Getting user media (video) ...');
  
  //비동기 모드, 장치에 대한 접근이 허용되면  then 이하가 실행된다.
  //Initializes media stream. 
  navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true  //비디오만 
  })
  .then(gotStream)  //스트립을 처리할 함수의 주소를 전달한다
  .catch(function(e) {
    alert('getUserMedia() error: ' + e.name);
  });
}

function gotStream(stream) {
  //여기서 스트림을 처리한다 
  console.log('getUserMedia video stream URL:', stream);
  window.stream = stream; // stream available to console
  video.srcObject = stream;
  //비디오가 준비가 되면 이, upon completion of a metadata load, execute the function
  video.onloadedmetadata = function() {
    photo.width = photoContextW = video.videoWidth;
    photo.height = photoContextH = video.videoHeight;
    console.log('gotStream with width and height:', photoContextW, photoContextH);
  };
  show(snapBtn);
}



/****************************************************************************
* Aux functions, mostly UI-related
****************************************************************************/

// capture, video tag capture
function snapPhoto() {
  photoContext.drawImage(video, 0, 0, photo.width, photo.height);
  show(photo, sendBtn);
}

function sendPhoto() {
  //이미지 저장후 Ajax로 서버로 전송하자 
  //var image = photo.toDataURL("image/png").replace("image/png", "image/octet-stream");  
  //window.location.href=image;
  
  var dataURL = photo.toDataURL();
  $.ajax({
     type: "POST", 
     //url: "http://localhost:9000/sample/json/canvas_ajax_upload_post.php",  //받아서 저장하자 
     url:'/save',
     data: {'id':'test', 'pwd':'1234', 'img': dataURL }      
  }).done(function(msg){ 
     alert(msg); 
  });
 
}


grabWebCamVideo();

/*
<?php
 
   $img = $_POST['img'];
   
   if (strpos($img, 'data:image/png;base64') === 0) {
       
      $img = str_replace('data:image/png;base64,', '', $img);
      $img = str_replace(' ', '+', $img);
      $data = base64_decode($img);
      $file = 'uploads/img'.date("YmdHis").'.png';
   
      if (file_put_contents($file, $data)) {
         echo "The canvas was saved as $file.";
      } else {
         echo 'The canvas could not be saved.';
      }   
     
   }
 
?>
*/
function snapAndSend() {
  snapPhoto();
  sendPhoto();
}

function renderPhoto(data) {
  var canvas = document.createElement('canvas');
  canvas.width = photoContextW;
  canvas.height = photoContextH;
  canvas.classList.add('incomingPhoto');
  // trail is the element holding the incoming images
  trail.insertBefore(canvas, trail.firstChild);

  var context = canvas.getContext('2d');
  var img = context.createImageData(photoContextW, photoContextH);
  img.data.set(data);
  context.putImageData(img, 0, 0);
}

function show() {
  Array.prototype.forEach.call(arguments, function(elem) {
    elem.style.display = null;
  });
}

function hide() {
  Array.prototype.forEach.call(arguments, function(elem) {
    elem.style.display = 'none';
  });
}

function randomToken() {
  return Math.floor((1 + Math.random()) * 1e16).toString(16).substring(1);
}

function logError(err) {
  if (!err) return;
  if (typeof err === 'string') {
    console.warn(err);
  } else {
    console.warn(err.toString(), err);
  }
}


  