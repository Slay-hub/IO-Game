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
io.on('connection', function(socket) {
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
  });
  socket.on('disconnect', function() {
    delete players[socket.id];
  });
});
setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);