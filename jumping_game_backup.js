window.onload = init;

var canvas;
var player;
var ctx;
var gravity = 0.8;
var tiles = [];
var FPS = 50;

// player images
var playerLeft;
var playerRight;
var playerStop;

function init(){
	
	playerLeft = new Image();
	playerLeft.src = "hero_left.png";
	
	playerRight = new Image();
	playerRight.src = "hero_right.png";
	
	canvas = document.getElementById('myCanvas');
	ctx = canvas.getContext('2d');
	
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	
	// player object
	player = {
		totalFrames : 7,
		timeperframe : 1000/this.totalFrames,
		x:100,
		y:00,
		width:36,
		height:42,
		speedX:0,
		speedY:0,
		maxSpeedX:3,
		jumpSpeed: -11,
		maxSpeedY:11,
		friction : 0.8,
		left:false,
		right:false,
		jumping:false,
		falling:true,
		
		leftFrameIndx:4,
		rightFrameIndx:1,
		
		subImgX : 0,
		subImgY : 0,
		currentFrame : 0,
		lastUpdate : 0,
		
		currentImg: playerRight,
		
		update : function(ticker){
			if((ticker - this.lastUpdate) >= this.timeperframe){
				if(!this.left && !this.right && !this.falling){
					this.currentImg = playerRight;
					this.rightFrameIndx++;
					if(this.rightFrameIndx > 3){
					  console.log('right frame');
					  this.rightFrameIndx = 1;
				    }
					this.lastUpdate = ticker;
				}else if(this.right){
					this.rightFrameIndx++;
					if(this.rightFrameIndx > 3){
					  console.log('right frame');
					  this.rightFrameIndx = 1;
				    }
				 //this.currentImg = playerRight;
				 this.lastUpdate = ticker;
			    }else if(this.left){
					
				   this.leftFrameIndx++;
				   // alert(this.leftFrameIndx);
				   if(this.leftFrameIndx > 5){
					 console.log('left frame');
					 
					 this.leftFrameIndx = 4;
				   }
				//this.currentImg = playerLeft;
				this.lastUpdate = ticker;
			    }
			 
		   }
		},
		
		draw: function(){
			console.log(this.leftFrameIndx + ' ' + this.rightFrameIndx);
			/*
			ctx.rect(this.x, this.y, this.width, this.height);
			ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
			ctx.stroke();
			ctx.fillStyle = "green";
			ctx.fill();
			*/
			
			if(this.speedX == 0 && this.speedY == 0){
				ctx.drawImage(playerRight,0,0,36,42,this.x,this.y,36,42);
			}else if(this.right){
				ctx.drawImage(playerRight,36 * this.rightFrameIndx,0,36,42,this.x,this.y,36,42); 
			}else if(this.left){
				ctx.drawImage(playerLeft,36 * this.leftFrameIndx,0,36,42,this.x,this.y,36,42); 
			}
			
		}
	};
	
	// create tiles
	tiles.push({
		x:0,
		y:0,
		width: 40,
		height: canvas.height
	});
	tiles.push({
		x:canvas.width-10,
		y:0,
		width: 40,
		height: canvas.height
	});
	tiles.push({
		x:0,
		y:canvas.height-10,
		width: 40,
		height: 20
	});
	tiles.push({
		x:150,
		y:320,
		width: 40,
		height: 20
	});
	tiles.push({
		x:0,
		y:canvas.height-10,
		width: canvas.width,
		height: 20
	});
	tiles.push({
		x:120,
		y:300,
		width: 40,
		height: 20
	});
}


function drawTiles(){
	for(var x=0;x<tiles.length;x++){
		ctx.rect(tiles[x].x,tiles[x].y,tiles[x].width,tiles[x].height);
		ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
		ctx.stroke();
		ctx.fillStyle = "green";
		ctx.fill();
	}
}

function update(ticker){
	
	// horizontal movement
	if(player.left){
		if(player.speedX > -player.maxSpeedX){
		  player.speedX--;
		}
	}else if(player.right){
		if(player.speedX < player.maxSpeedX){
		  player.speedX++;
		}
	}else{
		if(player.speedX < 0){
			player.speedX += player.friction;
			if(player.speedX > 0){
				player.speedX=0;
			}
		}else if(player.speedX>0){
			player.speedX -= player.friction;
			if(player.speedX < 0){
				player.speedX=0;
			}
		}
	}
	
	player.x = player.x + player.speedX;
	
	// vertical movement
	if(player.jumping){
		player.speedY = player.jumpSpeed;
		player.jumping = false;
		player.falling = true;
	}
	
	player.speedY = player.speedY + gravity;
	
	player.y = player.y + player.speedY;
	
	if(player.speedY > player.maxSpeedY){
		player.speedY = player.maxSpeedY;
	}
		
	for(var x=0;x<tiles.length;x++){
		var colDir = checkCollision(player,tiles[x]);
		if(colDir ==='l' || colDir === 'r'){
			player.speedX = 0;
		}else if(colDir ==='t'){
			player.speedY = 0;
		}else if(colDir ==='b'){
			player.speedY = 0;
			player.falling = false;
		}
	}
	
	player.update(ticker);
}

function checkCollision(shapeA, shapeB){
	var colDir = null;// collision direction
	
	var xVector = (shapeA.x + (shapeA.width/2)) - (shapeB.x + (shapeB.width/2));
	var yVector = (shapeA.y + (shapeA.height/2)) - (shapeB.y + (shapeB.height/2));
	
	var halfWidthsSum = (shapeA.width/2) + (shapeB.width/2);
	var halfHeightsSum = (shapeA.height/2) + (shapeB.height/2);
	
	var xOffset = halfWidthsSum - Math.abs(xVector);
	var yOffset = halfHeightsSum - Math.abs(yVector);
	
	if( Math.abs(xVector) < halfWidthsSum && Math.abs(yVector) < halfHeightsSum ){
		if( xOffset > yOffset ){
			// top or bottom collision
			if( yVector > 0){
				// top collision
				colDir='t';
				shapeA.y += Math.abs(yOffset);
			}else{
				colDir='b';
				shapeA.y -= Math.abs(yOffset);
			}
		}else{
			// left or right collision
			if( xVector > 0){
				// left collision
				colDir='l';
				shapeA.x += Math.abs(xOffset);
			}else{
				colDir='r';
				shapeA.x -= Math.abs(xOffset);
			}
		}
	}
	
	return colDir;
}

function draw(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
	player.draw();
	drawTiles();
}

function gameLoop(){
	var d = new Date();
	update(d.getTime());
	draw();
}

// call gameLoop every 20ms
setInterval(gameLoop, 1000/FPS);

function keyDownHandler(e){
	if(e.keyCode==38){
		//up
		if(!player.falling){ 
			player.jumping = true;
		}
	}else if(e.keyCode==37){
		//left
		player.left=true;
	}else if(e.keyCode==39){
		//right
		player.right=true;
	}
}
function keyUpHandler(e){
	if(e.keyCode==38){
		//up
	}else if(e.keyCode==37){
		//left
		player.left=false;
	}else if(e.keyCode==39){
		//right
		player.right=false;
	}
}