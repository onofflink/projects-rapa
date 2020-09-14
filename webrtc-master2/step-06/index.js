'use strict';

var os = require('os');
var nodeStatic = require('node-static');
var http = require('http');
var socketIO = require('socket.io');


var fileServer = new(nodeStatic.Server)();

//서버 시작 
var app = http.createServer(function(req, res) {
  //서버가 만들어지면 파일서버가 작동함 
  fileServer.serve(req, res);

}).listen(8080, function(){
	console.log("server start at 8080");
});

//윈소켓 생성후 연결 요청을 기다린다. 
var io = socketIO.listen(app); //서버로 부터 요청을 받는다
io.sockets.on('connection', function(socket) {

  // convenience function to log server messages on the client
  //서버메시지를 저장할 로그 
  function log() {
    var array = ['Message from server:']; //서버 
    array.push.apply(array, arguments);
    socket.emit('log', array);  
    //socket.emit('서버로 보낼 이벤트명', 데이터);
  }

  socket.on('message', function(message) {
    log('Client said: ', message);
    // for a real app, would be room-only (not broadcast)
    socket.broadcast.emit('message', message);
  });

  socket.on('create or join', function(room) {
    log('Received request to create or join room ' + room);

    var clientsInRoom = io.sockets.adapter.rooms[room];
    var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
    log('Room ' + room + ' now has ' + numClients + ' client(s)');

    if (numClients === 0) {
      socket.join(room);
      log('Client ID ' + socket.id + ' created room ' + room);
      socket.emit('created', room, socket.id);
    } else if (numClients === 1) {
      log('Client ID ' + socket.id + ' joined room ' + room);
      // io.sockets.in(room).emit('join', room);
      socket.join(room);
      socket.emit('joined', room, socket.id);
      io.sockets.in(room).emit('ready', room);
      socket.broadcast.emit('ready', room);
    } else { // max two clients
      socket.emit('full', room);
    }
  });

  socket.on('ipaddr', function() {
    var ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
      ifaces[dev].forEach(function(details) {
        if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
          socket.emit('ipaddr', details.address);
        }
      });
    }
  });

  socket.on('disconnect', function(reason) {
    console.log(`Peer or server disconnected. Reason: ${reason}.`);
    socket.broadcast.emit('bye');
  });

  socket.on('bye', function(room) {
    console.log(`Peer said bye on room ${room}.`);
  });
});
