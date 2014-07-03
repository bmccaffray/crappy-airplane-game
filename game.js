var canvasBg = document.getElementById('canvasBg');
var ctxBg = canvasBg.getContext('2d');
var canvasClouds = document.getElementById('canvasClouds');
var ctxClouds = canvasClouds.getContext('2d');
var canvasJet = document.getElementById('canvasJet');
var ctxJet = canvasJet.getContext('2d');
var canvasEnemy = document.getElementById('canvasEnemy');
var ctxEnemy = canvasEnemy.getContext('2d');
var canvasHud = document.getElementById('canvasHud');
var ctxHud = canvasHud.getContext('2d');
ctxHud.fillStyle = 'hsla(0, 0%, 0%, 0.5)';
ctxHud.font = 'bold 20px Arial';

var soundEfx = new Audio('pew.wav');

var jet1 = new Jet();
var hud = new Hud();
var xp = new Xp();
var btnPlay = new Button(325, 440, 283, 337);
var gameWidth = canvasBg.width;
var gameHeight = canvasBg.height;
var mouseX = 0;
var mouseY = 0;
var isPlaying = false;
var requestAnimFrame = window.requestAnimationFrame ||
						window.webkitRequestAnimationFrame ||
						window.mozRequestAnimationFrame ||
						window.msRequestAnimationFrame || 
						window.oRequestAnimationFrame ||
						function(callback){
							window.setTimeout(callback, 1000 / 60);
						};
	
var totalEnemies = 0;
var enemies = [];
var spawnAmount = 5;

var imgSprite = new Image();
imgSprite.src = 'images/sprite.png';
imgSprite.addEventListener('load', init, false);

var bgDrawX1 = 0;
var bgDrawX2 = 1439;
function moveBg(){
	bgDrawX1 -= .5;
	bgDrawX2 -= .5;
	if(bgDrawX1 <= -1439){
		bgDrawX1 = 1439;
	} else if(bgDrawX2 <= -1439){
		bgDrawX2 = 1439;
	}
	drawBg();
}

var cloudDrawX1 = 0;
var cloudDrawX2 = 1439;
function moveClouds(){
	cloudDrawX1 -= .75;
	cloudDrawX2 -= .75;
	if(cloudDrawX1 <= -1439){
		cloudDrawX1 = 1439;
	} else if(cloudDrawX2 <= -1439){
		cloudDrawX2 = 1439;
	}
	drawClouds();
}

function init(){
	spawnEnemy(spawnAmount);
	drawMenu();
	document.addEventListener('click', mouseClicked, false);
}

function playGame(){
	drawBg();
	drawClouds();
	hud.draw();
	startLoop();
	document.addEventListener('keydown', checkKeyDown, false);
	document.addEventListener('keyup', checkKeyUp, false);
	document.removeEventListener('click', mouseClicked, false);
}

function spawnEnemy(number){
	for(var i = 0; i < number; i++){
		enemies[i] = new Enemy();
	}
}

function drawAllEnemies(){
	clearCtxEnemy();
	for(var i = 0; i < enemies.length; i++){
		enemies[i].draw();
	}
}

function loop(){
	if(isPlaying){
		moveBg();
		moveClouds();
		jet1.draw();
		xp.draw();
		drawAllEnemies();
		requestAnimFrame(loop);
	}
}

function startLoop(){
	isPlaying = true;
	loop();
}
function stopLoop(){
	isPlaying = false;
}

function drawMenu(){
	ctxBg.drawImage(imgSprite, 0, 565, gameWidth, gameHeight, 0, 0, gameWidth, gameHeight);
}

function Jet(){
	this.srcX = 0;
	this.srcY = 451;
	this.width = 89;
	this.height = 35;
	this.speed = 2;
	this.drawX = 200;
	this.drawY = 200;
	this.gunX = this.drawX + 80;
	this.gunY = this.drawY + 30;
	this.boundryLx = this.drawX-2;
	this.boundryRx = this.drawX+this.width+2;
	this.boundryTy = this.drawY-2
	this.boundryBy = this.drawY+this.height+2;
	this.isUpKey = false;
	this.isRightKey = false;
	this.isDownKey = false;
	this.isSpacebar = false;
	this.isShooting = false;
	this.bullets = [];
	this.currentBullet = 0;
	this.bulletSpeed = 3;
	for (var i = 0; i < 20; i++) {
		this.bullets[i] = new Bullet();
	};
}
Jet.prototype.draw = function (){
	clearCtxJet();
	this.checkDirection();
	this.boundryCheck();
	this.checkShooting();
	this.drawAllBullets();
	ctxJet.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
};
Jet.prototype.boundryCheck = function (){
	this.gunX = this.drawX + 80;
	this.gunY = this.drawY + 30;
	this.boundryLx = this.drawX-2;
	this.boundryRx = this.drawX+this.width+2;
	this.boundryTy = this.drawY-2
	this.boundryBy = this.drawY+this.height+2;
};
Jet.prototype.checkDirection = function (){
	if(this.isUpKey && this.boundryTy > 0){
		this.drawY -= this.speed;
	}
	if(this.isRightKey && this.boundryRx < gameWidth){
		this.drawX += this.speed;
	}
	if(this.isDownKey && this.boundryBy < gameHeight){
		this.drawY += this.speed;
	}
	if(this.isLeftKey && this.boundryLx > 0){
		this.drawX -= this.speed;
	}
};
Jet.prototype.drawAllBullets = function(){
	for(var i = 0; i < this.bullets.length; i++){
		if(this.bullets[i].drawX >= 0){
			this.bullets[i].draw();
		}
		if(this.bullets[i].explosion.hasHit){
			this.bullets[i].explosion.draw();
		}
	}
};
Jet.prototype.checkShooting = function(){
	if(this.isSpacebar && !this.isShooting){
		this.isShooting = true;
		this.bullets[this.currentBullet].fire(this.gunX, this.gunY);
		this.currentBullet++;
		if(this.currentBullet >= this.bullets.length){
			this.currentBullet = 0;
		}
	} else if(!this.isSpacebar){
		this.isShooting = false;
	}
};

function Enemy(){
	this.srcX = 0;
	this.srcY = 486;
	this.width = 89;
	this.height = 35;
	this.speed = 2;
	this.drawX = 800 + Math.floor(Math.random()*200);
	this.drawY = Math.floor(Math.random()*300);
}
Enemy.prototype.draw = function (){
	this.drawX -= this.speed;
	ctxEnemy.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
	this.checkEscaped();
};
Enemy.prototype.checkEscaped = function (){
	if(this.drawX + this.width <= 0){
		this.recycleEnemy();
	}
};
Enemy.prototype.recycleEnemy = function (){
	this.drawX = 800 + Math.floor(Math.random()*200);
	this.drawY = Math.floor(Math.random()*300);
};

function Bullet(){
	this.srcX = 89;
	this.srcY = 451;
	this.width = 5;
	this.height = 5;
	this.drawX = -10;
	this.drawY = 0;
	this.explosion = new Explosion();
}
Bullet.prototype.draw = function (){
	this.drawX += 3;
	ctxJet.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
	this.checkHitEnemy();
	if(this.drawX > gameWidth){
		this.recycle();
	}
};
Bullet.prototype.fire = function (startX, startY){
	this.drawX = startX;
	this.drawY = startY;
};
Bullet.prototype.checkHitEnemy = function (){
	for(var i = 0; i < enemies.length; i++){
		if(this.drawX >= enemies[i].drawX &&
			this.drawX <= enemies[i].drawX + enemies[i].width &&
			this.drawY >= enemies[i].drawY &&
			this.drawY <= enemies[i].drawY + enemies[i].height
			){
			this.explosion.drawX = enemies[i].drawX - (this.explosion.width / 2);
			this.explosion.drawY = enemies[i].drawY;
			this.explosion.hasHit = true;
			this.recycle();
			enemies[i].recycleEnemy();
			xp.addXp();
		}
	}
};
Bullet.prototype.recycle = function (){
	this.drawX = -10;
};

function Explosion(){
	this.srcX = 0;
	this.srcY = 521;
	this.width = 89;
	this.height = 40;
	this.drawX = 0;
	this.drawY = 0;
	this.hasHit = false;
	this.currentFrame = 0;
	this.totalFrames = 5;
}
Explosion.prototype.draw = function (){
	if(this.currentFrame <= this.totalFrames){
		ctxJet.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX+30, this.drawY, this.width, this.height);
		this.currentFrame++
	} else {
		this.hasHit = false;
		this.currentFrame = 0;
	}
};

function drawBg(){
	var srcX = 0;
	var srcY = 0;
	var drawY = 0;
	var bgWidth = 1440;
	ctxBg.clearRect(0, 0, gameWidth, gameHeight);
	ctxBg.drawImage(imgSprite, srcX, srcY, bgWidth, gameHeight, bgDrawX1, drawY, bgWidth, gameHeight);
	ctxBg.drawImage(imgSprite, srcX, srcY, bgWidth, gameHeight, bgDrawX2, drawY, bgWidth, gameHeight);
}

function drawClouds(){
	var srcX = 0;
	var srcY = 1137;
	var drawY = 0;
	var cloudWidth = 1440;
	ctxClouds.clearRect(0, 0, gameWidth, gameHeight);
	ctxClouds.drawImage(imgSprite, srcX, srcY, cloudWidth, gameHeight, cloudDrawX1, drawY, cloudWidth, gameHeight);
	ctxClouds.drawImage(imgSprite, srcX, srcY, cloudWidth, gameHeight, cloudDrawX2, drawY, cloudWidth, gameHeight);
}

function Hud(){
	this.srcX = 0;
	this.srcY = 1017;
	this.width = 720;
	this.height = 100;
	this.drawX = 0;
	this.drawY = 350;
	this.levelX = 20;
	this.levelY = 400;
	this.level = 1;
}
Hud.prototype.draw = function (){
	clearCtxHud();
	ctxHud.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
	ctxHud.fillText("Level "+this.level, this.levelX, this.levelY);
}
Hud.prototype.addLevel = function (){
	this.level++;
	if(this.level >= 10){
			stopLoop();
			document.getElementById('pausedWin').style.display = "block";
	}
	this.draw();
}

function Xp(){
	this.srcX = 0;
	this.srcY = 1117;
	this.width = 280;
	this.height = 20;
	this.drawX = -60;
	this.drawY = 430;
	this.xpGained = 100;
}
Xp.prototype.draw = function (){
	ctxJet.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
	
};
Xp.prototype.addXp = function (){
	this.drawX += this.xpGained;
	this.checkLevelUp();
};
Xp.prototype.checkLevelUp = function (){
	if(this.drawX >= 220){
		this.recycle();
		hud.addLevel();
	}
};
Xp.prototype.recycle = function (){
	this.drawX = -60;
};

function Button(xL, xR, xT, xB){
	this.xLeft = xL;
	this.xRight = xR;
	this.yTop = xT;
	this.yBottom = xB;
}
Button.prototype.checkClicked = function (){
	if(this.xLeft <= mouseX && this.xRight >= mouseX && this.yTop <= mouseY && this.yBottom >= mouseY){
		return true;
	}
};

function mouseClicked(e){
	mouseX = e.pageX - canvasBg.offsetLeft;
	mouseY = e.pageY - canvasBg.offsetTop;
	if(btnPlay.checkClicked()){
		playGame();
	}
}
function checkKeyDown(e){
	var keyID = e.keyCode || e.which;
	if(keyID === 87){
		// w = 87
		jet1.isUpKey = true;
		e.preventDefault();
	}
	if(keyID === 68){
		// d = 68
		jet1.isRightKey = true;
		e.preventDefault();
	}
	if(keyID === 83){
		// s = 83
		jet1.isDownKey = true;
		e.preventDefault();
	}
	if(keyID === 65){
		// a = 65
		jet1.isLeftKey = true;
		e.preventDefault();
	}
	if(keyID === 32){
		// space = 32
		jet1.isSpacebar = true;
		soundEfx.play();
		soundEfx.currentTime=0
		e.preventDefault();
	}
	if(keyID === 27){
		// esc = 27
		if(isPlaying && hud.level < 10){
			stopLoop();
			document.getElementById('pausedOverlay').style.display = "block";

		} else if(!isPlaying && hud.level < 10) {
			startLoop();
			document.getElementById('pausedOverlay').style.display = "none";
		}
		e.preventDefault();
	}
}
function checkKeyUp(e){
	var keyID = e.keyCode || e.which;
	if(keyID === 87){
		// w = 87
		jet1.isUpKey = false;
		e.preventDefault();
	}
	if(keyID === 65){
		// a = 65
		jet1.isLeftKey = false;
		e.preventDefault();
	}
	if(keyID === 83){
		// s = 83
		jet1.isDownKey = false;
		e.preventDefault();
	}
	if(keyID === 68){
		// d = 68
		jet1.isRightKey = false;
		e.preventDefault();
	}
	if(keyID === 32){
		// space = 32
		jet1.isSpacebar = false;
		e.preventDefault();
	}
}

function clearCtxJet(){
	ctxJet.clearRect(0, 0, gameWidth, gameHeight);
}
function clearCtxEnemy(){
	ctxEnemy.clearRect(0, 0, gameWidth, gameHeight);
}
function clearCtxHud(){
	ctxHud.clearRect(0, 0, gameWidth, gameHeight);
}


