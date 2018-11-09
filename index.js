var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/main.js', function(req, res){
  res.sendFile(__dirname + '/main.js');
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

var socket_list = new Array();
var placementX=0;
var placementY=0;
var roomno = 1;

io.on('connection', function(socket) { 
  //socket_list.push(socket.id);
  let room;
  let players = {};
  //increase roomno if 2 clients are present in a room
  socket.on('join', function() {
    if(io.nsps['/'].adapter.rooms["room"+roomno] && io.nsps['/'].adapter.rooms["room"+roomno].length > 1) roomno++;
    room = `room${roomno}`;
    socket.join(room);
    console.log(room);
  });
  placementX+=200;
  if(placementX>1000){
    placementX=200;
    placementY+=300;
  }
  socket.on('new player', function() {
    players[socket.id] = {
      x: placementX,
      y: placementY
    };
      socket_list.push(socket.id);
  });
  socket.on('input', function(data) {
    var player = players[socket.id] || {};
    if (data.left && player.x > 0) {
      player.x -= 5;
    }
    if (data.up && player.y > 0) {
      player.y -= 5;
    }
    if (data.right && player.x < data.canvasx - 100) {
      player.x += 5;
    }
    if (data.down && player.y < data.canvasy- 100) {
      player.y += 5;
    }

    var i;
    var j;

    /*(//if(socket_list.length>1){
    for(var i = 0; i < socket_list.length; i++) { 
      for(var j = 0; j < socket_list.length; j++) { 
      var collide1 = players[socket_list[i]]; //|| {};
      var collide2 = players[socket_list[j]]; //|| {};

      if(socket_list[j] == socket_list[i]){
        break;
      }

      if(players[socket_list[i]].x+100 >= players[socket_list[j]].x && players[socket_list[i]].x <= players[socket_list[j]].x+100 && players[socket_list[i]].y+100 >= players[socket_list[j]].y && players[socket_list[i]].y <= players[socket_list[j]].y+100){
        //change what you want collision to do here (box 1 hits box 2)
        collide1.x=200;
        collide1.y=200;
        collide2.x=400;
        collide2.y=400;
      }
      if(players[socket_list[j]].x >= players[socket_list[i]].x && players[socket_list[j]].x <= players[socket_list[i]].x+100 && players[socket_list[j]].y >= players[socket_list[i]].y && players[socket_list[j]].y <= players[socket_list[i]].y+100){
         //change what you want collision to do here (box 2 hits box 1)
        collide1.x=200;
        collide1.y=200;
        collide2.x=400;
        collide2.y=400;
      }
    }
  }
*/  
  });
  socket.on('disconnect', function() {
    var i;
    delete players[socket.id];
       for(var i = 0; i < socket_list.length; i++) { 
        if(socket.id == socket_list[i]){
          socket_list.splice(i, 1);
          i=socket_list.length+2;
        }
       }

  });
  setInterval(function() {
  io.to(room).emit('state', players);
}, 1000 / 60);
});
