window.gameRowsNumber = prompt("Enter the number of rows to play", 9);
window.gameColsNumber = prompt("Enter the number of columns to play", 6);

const TILE_HEIGHT = 60;
const TILE_WIDTH = 90;
const ROWS_NUMBER = window.gameRowsNumber;
const COLS_NUMBER = window.gameColsNumber;
const canvas_height = TILE_HEIGHT * ROWS_NUMBER;
const canvas_width = TILE_WIDTH * COLS_NUMBER;

// Enemies our player must avoid
var Enemy = function () {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started
  this.height = 45;
  this.width = 72;
  this.enemiesNumber = ROWS_NUMBER - 3;
  this.x = 0 - this.width;
  this.y = Math.random() * (canvas_height - this.height) + this.height;
  this.speed = Math.random() * 300 + 100;
  this.enemies = [];
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = "images/enemy-bug.png";
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  this.checkCollisions();

  if (this.x >= canvas_width) {
    this.x = -TILE_WIDTH;
  }
  this.x += this.speed * dt;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

const createEnimies = function (
  { enemiesNumber, y, speed, enemies },
  tileHeight,
  tileWidth
) {
  for (let i = 0; i < enemiesNumber; i++) {
    enemies.push({});
    enemies[i].y = y + tileHeight * i;
    enemies[i].speed = speed;
  }

  enemies.forEach((e) => {
    allEnemies.push(e);
  });
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function () {
  this.height = 45;
  this.width = 45;
  this.x = () =>
    COLS_NUMBER % 2 != 0
      ? TILE_WIDTH * Math.floor(COLS_NUMBER / 2)
      : canvas_width - TILE_WIDTH;
  this.y = TILE_HEIGHT * (ROWS_NUMBER - 1.5);
  this.sprite = "images/char-boy.png";
};

Player.prototype.resetPlayerPosition = function ({ x, y }) {
  this.x = x;
  this.y = y;
};

Player.prototype.update = function () {
  if (this.y < 0) {
    setTimeout(() => {
      this.resetPlayerPosition(Player);
    }, 200);
  }
};

Player.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function (key) {
  switch (key) {
    case "up":
      if (this.y > 0) {
        this.y -= TILE_HEIGHT;
      }
      break;
    case "down":
      if (this.y <= canvas_height - TILE_HEIGHT * 2) {
        this.y += TILE_HEIGHT;
      }
      break;
    case "left":
      if (this.x > 0) {
        this.x -= TILE_WIDTH;
      }
      break;
    case "right":
      if (this.x < canvas_width - TILE_WIDTH) {
        this.x += TILE_WIDTH;
      }
      break;
    default:
      break;
  }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

let player = new Player();

let allEnemies = [];
createEnimies(new Enemy(), TILE_HEIGHT, TILE_WIDTH);
console.log("allEnemies:", allEnemies);

function finish() {
  score++;
  Player.resetPlayerPosition(Player);
}

function lost() {
  if (score !== 0) {
    score--;
  }
  Player.resetPlayerPosition(Player);
}

Enemy.prototype.checkCollisions = function () {
  for (let index = 0; index < allEnemies.length; index++) {
    if (collision(player, allEnemies[index])) {
      lost();
    }
  }
};

function collision(first, second) {
  return !(
    first.x > second.x + second.width ||
    first.x + first.width < second.x ||
    first.y > second.y + second.height ||
    first.y + first.height < second.y
  );
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener("keyup", function (e) {
  var allowedKeys = {
    37: "left",
    38: "up",
    39: "right",
    40: "down",
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
