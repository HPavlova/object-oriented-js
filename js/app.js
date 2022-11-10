window.gameRowsNumber = prompt(
  "Enter the number of rows to play no more than 9",
  9
);
window.gameColsNumber = prompt(
  "Enter the number of columns to play no more than 6",
  6
);

const TILE_HEIGHT = 83;
const TILE_WIDTH = 101;
const ROWS_NUMBER = window.gameRowsNumber;
const COLS_NUMBER = window.gameColsNumber;
const canvas_height = TILE_HEIGHT * ROWS_NUMBER;
const canvas_width = TILE_WIDTH * COLS_NUMBER;
let score = 0;

var Enemy = function () {
  this.height = 45;
  this.width = 72;
  this.enemiesNumber = ROWS_NUMBER - 3;
  this.x = 0 - this.width;
  this.y = TILE_HEIGHT * 0.75;
  this.speed = Math.random() * 300 + 100;
  this.sprite = "images/enemy-bug.png";
};

Enemy.prototype.update = function (dt) {
  this.checkCollisions();

  if (this.x >= canvas_width) {
    this.x = -TILE_WIDTH;
  }
  this.x += this.speed * dt;
};

Enemy.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

const createEnimies = function ({ enemiesNumber, y }, tileHeight) {
  for (let i = 0; i < enemiesNumber; i++) {
    allEnemies.push(new Enemy());
    allEnemies[i].y = y + tileHeight * i;
  }
};

var Player = function () {
  this.height = 45;
  this.width = 45;
  this.x = (canvas_width - TILE_WIDTH) / 2;
  this.y = TILE_HEIGHT * (ROWS_NUMBER - 1.5);
  this.sprite = "images/char-boy.png";
};

Player.prototype.resetPlayerPosition = function ({ x, y }) {
  player.x = x;
  player.y = y;
};

Player.prototype.update = function () {
  if (this.y < 0) {
    setTimeout(() => {
      player.resetPlayerPosition(new Player());
    }, 200);
  }
};

Player.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  scoreBoard();
};

Player.prototype.handleInput = function (key) {
  switch (key) {
    case "up":
      if (this.y < TILE_HEIGHT) {
        finish();
      } else if (this.y > 0) {
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

function scoreBoard() {
  ctx.font = "bold 40px serif";
  ctx.strokeStyle = "black";
  ctx.fillStyle = "grey";
  ctx.strokeText("Score:", 0, 30);
  ctx.fillText(score, 120, 33);
}

let player = new Player();

let allEnemies = [];
createEnimies(new Enemy(), TILE_HEIGHT);

function finish() {
  score++;
  player.resetPlayerPosition(new Player());
}

function lost() {
  if (score !== 0) {
    score--;
  }
  player.resetPlayerPosition(new Player());
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

document.addEventListener("keyup", function (e) {
  var allowedKeys = {
    37: "left",
    38: "up",
    39: "right",
    40: "down",
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
