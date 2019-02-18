const fieldWidth = 101;
const fieldHeight = 83;

/*** Enemies ***/

var Enemy = function() {
	this.x = -150;
	this.y = getRandomInt(1, 5) * fieldHeight - (fieldHeight / 2) ;
	this.speed = Math.floor(Math.random() * 50) / 10 + 1;
	this.sprite = 'images/enemy' + getRandomInt(1, 3) + '.png';
};

// Update the enemy's position
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
	// Check for collision
	const hitboxTolerance = 50;
	if (this.y === player.y && (this.x + fieldWidth) > (player.x + hitboxTolerance) && this.x < (player.x + fieldWidth - hitboxTolerance) ) {
		player.getsHit();
	}
	
	// If the enemy is on the board, he moves to the right
	// When he has reached the right end, he is moved back to the left on a random lane.
	if (this.x < 707) {
		this.x += this.speed;
	} else {
		this.x = -150;
		this.y = getRandomInt(1, 5) * fieldHeight - (fieldHeight / 2) ;
		this.speed = Math.floor(Math.random() * 50) / 10 + 1;
	}
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


/*** Player ***/

var Player = function() {
	this.lifes = 3;
	this.fieldX = 3;
	this.fieldY = 5;
	this.x = this.fieldX * fieldWidth;
	this.y = this.fieldY * fieldHeight - (fieldHeight / 2);
    this.sprite = 'images/char.png';
};

// Update the player's position according to the field size
Player.prototype.update = function() {
	this.x = this.fieldX * fieldWidth;
	this.y = this.fieldY * fieldHeight - (fieldHeight / 2);
}

// Draw the player on the screen
Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Handle the controls of the player
// Parameter: key, the pressed key
Player.prototype.handleInput = function(key) {
	if (!wonScreen.visible && !lostScreen.visible) {
		switch(key) {
			case 'left':
				if (this.fieldX > 0){
					this.fieldX--;
				};			
				break;
			case 'up':
				if (this.fieldY > 0){
					this.fieldY--;
					if (this.fieldY === 0) {
						this.wins();
					}
				};
				break;
			case 'right':
				if (this.fieldX < 6){
					this.fieldX++;
				};
				break;
			case 'down':
				if (this.fieldY < 5){
					this.fieldY++;
				};
				break;
			default: 
				break;
		}		
	} else {
		if (key === 'enter') {
			location.reload();
		}
	}
};

// Remove a heart from the player, when he gets hit
Player.prototype.getsHit = function() {
	this.moveToStartPosition();
	this.lifes--;
	allHearts[this.lifes].visible = false;
	if (this.lifes <= 0) {
		this.dies();
	};
};

// Shows the lost screen
Player.prototype.dies = function() {
	lostScreen.visible = true;
};

// Shows the won screen
Player.prototype.wins = function() {
	this.moveToStartPosition();
	wonScreen.visible = true;
};

// Resets the player to the starting position
Player.prototype.moveToStartPosition = function() {
	this.fieldX = 3;
	this.fieldY = 5;
};


/*** Heart ***/

// Parameter: nr, is the index of the heart. Needed for positioning.
var Heart = function(nr) {
	this.sprite = 'images/heart.png';
	this.x = nr * 35 + 10;
	this.y = 60;
	this.visible = true;
}

// Hide a heart
Heart.prototype.hide = function() {
	this.visible = false;
}

// Draw the heart on the screen
Heart.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


/*** Won Screen ***/

var WonScreen = function() {
	this.sprite = 'images/won.png';
	this.x = 104;
	this.y = 60;
	this.visible = false;
}

// Show the won screen
WonScreen.prototype.show = function() {
	this.visible = true;
}

// Draw the won screen on the screen
WonScreen.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


/*** Lost Screen ***/

var LostScreen = function() {
	this.sprite = 'images/lost.png';
	this.x = 104;
	this.y = 60;
	this.visible = false;
}

// Show the lost screen
LostScreen.prototype.show = function() {
	this.visible = true;
}

// Draw the lost screen on the screen
LostScreen.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


/*** Create objects ***/

let player = new Player();

let allHearts = [];
for (let i = 0; i <= player.lifes - 1; i++) {
	allHearts.push(new Heart(i));
}

let allEnemies = [];
for (let i = 0; i < 8; i++) {
	allEnemies.push(new Enemy());
}

let wonScreen = new WonScreen();
let lostScreen = new LostScreen();


/*** Events ***/

document.addEventListener('keydown', function(e) {
    var allowedKeys = {
		13: 'enter',
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};

    player.handleInput(allowedKeys[e.keyCode]);
});


/*** Helper functions ***/

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}