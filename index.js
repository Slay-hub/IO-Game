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

var players = {};
var socket_list = new Array();
io.on('connection', function(socket) {
  socket_list.push(socket.id);
  socket.on('new player', function() {
    players[socket.id] = {
      x: 300,
      y: 300
    };
  });
  socket.on('input', function(data) {
    var player = players[socket.id] || {};
    if (data.left) {
      player.x -= 5;
    }
    if (data.up) {
      player.y -= 5;
    }
    if (data.right ) {
      player.x += 5;
    }
    if (data.down) {
      player.y += 5;
    }
    var player = players[socket.id]||{};
    var i;

    for(var i = 0; i < socket_list.length; i++) { 

      if(socket.id == socket_list[i]){
        break;
      }
      if(player.x >= players[socket_list[i]].x){
        player.x = 0;
      }
    }
  
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
});
setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);