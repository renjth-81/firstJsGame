window.onload = preload;

var leftKeyPressed = false;
var rightKeyPressed = false;
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
// var planeImg = document.getElementById("planeImg");
var planeImg = null;

var x = 100;
var y = 100;
var width = 30;
var height = 30;
var dx = 5;
var dy = 0;

var angle = 0;

function preload(){
	planeImg = new Image();
	planeImg.onload=function(){
		init();
	}
	planeImg.src = "plane.jpg";
	
}

function init(){
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	
	function gameLoop() {
		update();
		draw();
	}
	setInterval(gameLoop, 20);
}





function draw() {
	/*
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.rect(x, y, 30, 30);
  ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
  ctx.stroke();
  ctx.fillStyle = "green";
  ctx.fill();
  */
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(planeImg,0,0);
  ctx.save();
  
  //move canvas origin to 70,52
  ctx.translate(70,52);
  ctx.rotate(angle*Math.PI/180);
  ctx.drawImage(planeImg,-35,-26);
  ctx.restore();
  ctx.closePath();
  angle++;
}

function update() {
  if (leftKeyPressed && x > 0) {
    x -= dx;
  } else if (rightKeyPressed && x < canvas.width - width) {
    x += dx;
  }

}

function keyDownHandler(e) {
  if (e.keyCode == 37) {
    leftKeyPressed = true;
  } else if (e.keyCode == 39) {
    rightKeyPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 37) {
    leftKeyPressed = false;
  } else if (e.keyCode == 39) {
    rightKeyPressed = false;
  }
}


