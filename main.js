  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");

  var rightPressed = false;
  var leftPressed = false;
  var upPressed = false;
  var downPressed = false;
  var boxHeight = 70;
  var boxWidth = 70;
  var box_X = (canvas.width-boxWidth)/2;
  var box_Y = 70;

  function drawBox() {
    // drawing code
    ctx.beginPath();
    ctx.rect(box_X, box_Y,boxWidth,boxHeight);
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.closePath();
}

  function draw() {
    if(rightPressed && box_X < canvas.width-boxWidth) {
    box_X += 10;
}
    if(upPressed && box_Y > 0) {
    box_Y -= 10;
}
    if(downPressed && box_Y < canvas.height-boxHeight) {
    box_Y += 10;
}
else if(leftPressed && box_X > 0) {
    box_X -= 10;
}
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBox();

  }
//simple functions to handle keypresses
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if(e.keyCode == 39){
    rightPressed = true;
  }
  if(e.keyCode == 38){
    upPressed = true;
  }
    if(e.keyCode == 40){
    downPressed = true;
  }
  else if (e.keyCode == 37){
    leftPressed = true;
  }
}
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
  if(e.keyCode == 38){
    upPressed = false;
  }
    if(e.keyCode == 40){
    downPressed = false;
  }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}



setInterval(draw, 16);
