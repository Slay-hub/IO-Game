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
var bullets = {};
var socket_list = new Array();
var placementX=0;
var placementY=0;

io.on('connection', function(socket) { //changed placement so i don't need to move the box before opening it in a new tab
  //socket_list.push(socket.id);
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
    if(data.space){
      //add code for shooting and check if a bullet is already on screen
      //use data.direction for which side to shoot bullet on, 0 for left, 1 for right
      if(bullets[socket.id] == null){
        if(data.direction==0){
          bullets[socket.id] = {
            x: player.x-20,
            y: player.y+50,
            direction: 0,
            socketID: socket.id
          } // left instruction
        } else {
          bullets[socket.id]={
            x: player.x+120,
            y: player.y+50,
            direction: 1,
            socketID: socket.id
          } //right instruction
        }
      }

    }//spacebar instruction

    //bullet movement
    if(bullets[socket.id] != null){
      if(bullets[socket.id].direction == 0){
        bullets[socket.id].x-=5;
      } else if(bullets[socket.id].direction == 1){
        bullets[socket.id].x+=5;
      }
      //bullet collision
      if(bullets[socket.id].x > data.canvasx-20 || bullets[socket.id].x < 0){
         delete bullets[socket.id];
      }

      for(var i = 0; i < socket_list.length; i++) {
        for(var j = 0; j < socket_list.length; j++) { 
         
         /*if(socket_list[j] == socket_list[i]){
            break;
          }*/

          if(bullets[socket_list[i]] != null){
            if(bullets[socket_list[i]].x+10 >= players[socket_list[j]].x && bullets[socket_list[i]].x <= players[socket_list[j]].x+100 && bullets[socket_list[i]].y+10 >= players[socket_list[j]].y && bullets[socket_list[i]].y <= players[socket_list[j]].y+100){
              delete bullets[socket_list[i]];
            }
            if(players[socket_list[i]].x >= bullets[socket_list[j]]+10 && players[socket_list[i]].x+100 >= bullets[socket_list[j]].x && players[socket_list[i]].y <= bullets[socket_list[j]].y+10 && players[socket_list[i]].y+100 >= bullets[socket_list[j]].y){
              delete bullets[socket_list[j]];
            }

          } 

        } //end of j for
      } //end of i for

    }


    var i;
    var j;

    //if(socket_list.length>1){
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


  //}//end of if
  
  });
  socket.on('disconnect', function() {
    var i;
    delete players[socket.id];
    if(bullets[socket.id] != null){
      delete bullets[socket.id];
    }
       for(var i = 0; i < socket_list.length; i++) { 
        if(socket.id == socket_list[i]){
          socket_list.splice(i, 1);
          i=socket_list.length+2;
        }
       }

  });
});
setInterval(function() {
  io.sockets.emit('state', players, bullets);
}, 1000 / 60);