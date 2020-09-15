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
var photoContext = photo.getContext('2d');   
var d_id = document.getElementById('d_id');
var snapBtn = document.getElementById('snap');
var startBtn = document.getElementById('start');
var stopBtn = document.getElementById('stop');
var ip_address = ''
var latitude = 0
var longitude = 0
var address = {}
var photoContextW;
var photoContextH;

// 버튼에 이벤트 핸들러를 붙인다.  
d_id.addEventListener('blur',id_input)
snapBtn.addEventListener('click',snapPhoto)
startBtn.addEventListener('click', start); //캡처 
//ajax
stopBtn.addEventListener('click', stop); //서버로 사진을 보낸다
 
// Disable send buttons by default.

startBtn.disabled = true
stopBtn.disabled = true

/****************************************************************************
* User media (webcam)
****************************************************************************/
function grabWebCamVideo() {
  console.log('Getting user media (video) ...');
  getGPS();
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
  //비디오가 준비가 되면 이
  video.onloadedmetadata = function() {
    photo.width = photoContextW = video.videoWidth;
    photo.height = photoContextH = video.videoHeight;
    console.log('gotStream with width and height:', photoContextW, photoContextH);
  };
  show(snapBtn);
}

function get_location()
{
  fetch('https://ipapi.co/json/')
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    //console.log(data);
    ip_address = data['ip']
    latitude = data['latitude']
    longitude = data['longitude']
    console.log(ip_address,latitude,longitude)
  });

}

function getGPS(){
  navigator.geolocation.getCurrentPosition(function(pos) {
    latitude = pos.coords.latitude;
    longitude = pos.coords.longitude;
  });
}

/****************************************************************************
* Aux functions, mostly UI-related
****************************************************************************/
var timerId = null;
function snapPhoto() {

  photoContext.drawImage(video, 0, 0, photo.width, photo.height);
}


function start(){
  //timerId = setInterval(snapAndSend,3000);
  sendPhoto();
  startBtn.disabled = true
}
function id_input(){ 
    
  if (d_id.value == '')
  {
    clearInterval(timerId);
    startBtn.disabled = true;
    stopBtn.disabled = true;
    alert("ID 항목을 채워주세요");
  }
  else{
    startBtn.disabled = false;
    stopBtn.disabled = false;
   
  }
 

}
function stop(){
  if(timerId != null) {
    clearInterval(timerId);
    startBtn.disabled = false;
  }

}
//3초마다 호출되도록 
function sendPhoto() {
  //이미지 저장후 Ajax로 서버로 전송하자 
  //var image = photo.toDataURL("image/png").replace("image/png", "image/octet-stream");  
  //window.location.href=image;
  //gps업어와서 

    var dataURL = photo.toDataURL();
    //console.log(d_id)
    $.ajax({
      type: "POST",
      headers:{"Authorization":'KakaoAK 876e9dd3cee1b67c2f15c6a58cd44f9c'},
      url: "https://dapi.kakao.com/v2/local/geo/coord2address.json?x="+longitude+"&y="+latitude+"&input_coord=WGS84",  //받아서 저장하자 
      //url:'/save',
    }).done(function(msg){ 
      console.log(msg)
      //ajax_send(msg[""])  
    }
    )
 
}

function ajax_send(x, y, address)
{
  var dataURL = photo.toDataURL();
  $.ajax({  
    type: "POST",
    //headers:{"Authorization":'KakaoAK 876e9dd3cee1b67c2f15c6a58cd44f9c'},
    //url: "http://localhost:9000/sample/json/canvas_ajax_upload_post.php",  //받아서 저장하자 
    url:'/save',
    data: {'d_id':d_id.value, 'img': dataURL}      
  }).done(function(msg){ 
    console.log(msg); 
  });

}
/*
sendphoto 원본
  var dataURL = photo.toDataURL();
    //console.log(d_id)
    $.ajax({
      type: "POST",
      //headers:{"Authorization":'KakaoAK 876e9dd3cee1b67c2f15c6a58cd44f9c'},
      //url: "http://localhost:9000/sample/json/canvas_ajax_upload_post.php",  //받아서 저장하자 
      url:'/save',
      data: {'d_id':d_id.value, 'img':dataURL}  
    }).done(function(msg){ 
      console.log(msg); 
    })
*/



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


  