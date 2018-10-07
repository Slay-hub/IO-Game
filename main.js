var socket = io();


var movement = {
  up: false,
  down: false,
  left: false,
  right: false
}


var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
//var entities = [new Player(605, 70, 70, 70)];

/***************
Objects
***************/

//base entity object that ensures each object has these two functions to override
/*function Entity() {

  this.act = function() { return undefined; };
  this.draw = function() { return undefined; };

}

//player object
/*function Player(x, y, w, h) { 

  //this.prototype = Entity;
  Entity.call(this);
  this.posx = x;
  this.posy = y;
  this.width = w;
  this.height = h;

  this.act = function() {

    //movement
    if(rightPressed && this.posx < canvas.width-this.width) {
      this.posx += 10;
    }
    if(upPressed && this.posy > 0) {
      this.posy -= 10;
    }
    if(downPressed && this.posy < canvas.height-this.height) {
      this.posy += 10;
    }
    if(leftPressed && this.posx > 0) {
      this.posx -= 10;
    }

  };
}
/* this.draw = function() {

    ctx.beginPath();
    ctx.rect(this.posx, this.posy, this.width, this.height);
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.closePath();
    
  };

}
*/
/***************
Input handling
***************/

//simple functions to handle keypresses
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {

  //Directional keys
  if(e.keyCode == 39 ){
    movement.right = true;
  }
  if(e.keyCode == 38){
    movement.up = true;
  }
  if(e.keyCode == 40){
    movement.down = true;
  }
  if (e.keyCode == 37){
    movement.left = true;
  }

}
function keyUpHandler(e) {

  //Directional keys
  if(e.keyCode == 39) {
    movement.right = false;
  }
  if(e.keyCode == 38){
    movement.up = false;
  }
  if(e.keyCode == 40){
    movement.down = false;
  }
  if(e.keyCode == 37) {
    movement.left = false;
  }

}

/***************
Game Loop
***************/

/*function gameLogic() {

  //allow each entity to act
  entities.forEach(function(ent){
    ent.act();
  });

}

function gameDraw() {

  //clear the canvas

  //draw background and obstacles

  //draw players and other entities
  entities.forEach(function(ent){
    ent.draw();
  });

}

function gameLoop() {

  //handle logic
  gameLogic();

  //handle drawing
  gameDraw();
}
*/
//setInterval(gameLoop, 100);



socket.emit('new player');
setInterval(function() {
  socket.emit('movement', movement);
}, 1000 / 60);

socket.on('state', function(players) {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var id in players) {
    var player = players[id];
    ctx.beginPath();
    ctx.rect(player.x, player.y,100,100);
    ctx.strokeStyle = "red";
    ctx.stroke();
  }
});
