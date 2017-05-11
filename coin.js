window.onload = loadImages;
var coinImg;
var FPS = 50;

var canvas;
var ctx;
var coin = new Coin();
var startGame = false;

function loadImages(){
	coinImg=new Image();
	coinImg.onload=function(){
		init();
	}
	coinImg.src = "coin_sprite.png";
}

function init(){
	canvas = document.getElementById('myCanvas');
	ctx = canvas.getContext('2d');
	startGame = true;
	setInterval(gameLoop, 1000/FPS);
}

function gameLoop(){
	update();
	draw();
}

function update(){
	var d = new Date();
	coin.update(d.getTime());
}

function draw(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
	coin.draw();
}




function Coin(){
	this.totalFrames = 10;
	this.timeperframe = 1000/this.totalFrames;
	this.x=100;
	this.y=100;
	this.subImgX = 0;
	this.subImgY=0;
	this.currentFrame=0;
	this.lastUpdate=0;
	this.update=function(ticker){
		if((ticker - this.lastUpdate) >= this.timeperframe){
			this.currentFrame++;
			if(this.currentFrame == this.totalFrames){
				this.currentFrame = 0;
			}
			this.lastUpdate = ticker;
			this.subImgX = this.currentFrame * 44;
		}
	}
	
	this.draw=function(){
		//console.log(this.subImgX);
		ctx.drawImage(coinImg,this.subImgX,this.subImgY,44,40,this.x,this.y,44,40);
	}
}