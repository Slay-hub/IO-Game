var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var entities = [new Player(605, 70, 70, 70)];

/***************
Objects
***************/

//base entity object that ensures each object has these two functions to override
function Entity() {

  this.act = function() { return undefined; };
  this.draw = function() { return undefined; };

}

//player object
function Player(x, y, w, h) { 

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

  this.draw = function() {

    ctx.beginPath();
    ctx.rect(this.posx, this.poxy, this.width, this.height);
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.closePath();
    
  };

}

/***************
Input handling
***************/

//simple functions to handle keypresses
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {

  //Directional keys
  if(e.keyCode == 39){
    rightPressed = true;
  }
  if(e.keyCode == 38){
    upPressed = true;
  }
  if(e.keyCode == 40){
    downPressed = true;
  }
  if (e.keyCode == 37){
    leftPressed = true;
  }

}
function keyUpHandler(e) {

  //Directional keys
  if(e.keyCode == 39) {
    rightPressed = false;
  }
  if(e.keyCode == 38){
    upPressed = false;
  }
  if(e.keyCode == 40){
    downPressed = false;
  }
  if(e.keyCode == 37) {
    leftPressed = false;
  }

}

/***************
Game Loop
***************/

function gameLogic() {

  //allow each entity to act
  entities.forEach(function(ent){
    ent.act();
  });

}

function gameDraw() {

  //clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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

setInterval(gameLoop, 16);