const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");
ctx.font = "30px Arial";

const CANVAS_WIDTH = canvas.width; // canvas width
const CANVAS_HEIGHT = canvas.height; // canvas height

const POINT_BOARD_POS_Y = 50; // default point posY
const POINT_BOARD_P1_POS_X = 300; // default player 1 point posX
const POINT_BOARD_P2_POS_X = 500; // default player 2 point posX

const PADDLE_WIDTH = 20; // paddle width
const PADDLE_HEIGHT = 100; // paddle height
const PADDLE_P1_POS_X = 10; // player 1 paddle posX
const PADDLE_P2_POS_X = 770; // player 2 paddle posX
const PADDLE_START_POS_Y = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2; // paddle start posY (is equal to (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2)
const PADDLE_STEP = 5;

const BALL_RADIUS = 15;
const BALL_START_POS_X = CANVAS_WIDTH / 2;
const BALL_START_POS_Y = CANVAS_HEIGHT / 2;
const BALL_START_DIRECTION_X = 4.5;
const BALL_START_DIRECTION_Y = -11.5;

const STATE_CHANGE_INTERVAL = 20;

// padle actions
const PADDLE_ACTION_STOP = "stop";
const PADDLE_ACTION_UP = "up";
const PADDLE_ACTION_DOWN = "down";

// players buttons
const P1_BUTTON_UP = "KeyQ";
const P1_BUTTON_DOWN = "KeyA";
const P2_BUTTON_UP = "KeyP";
const P2_BUTTON_DOWN = "KeyL";
const PAUSE_BUTTON = "KeyB";

function isInBetween(val, min, max) {
  return val >= min && val <= max;
}

// oop
const ball = {
  x: BALL_START_POS_X,
  y: BALL_START_POS_Y,
  dx: BALL_START_DIRECTION_X,
  dy: BALL_START_DIRECTION_Y,

  moveByStep: function () {
    this.x += this.dx;
    this.y += this.dy;
    ``;
    // console.log(this.x, this.y, this.dx, this.dy);
  },
  shouldBounceFromTopWall: function () {
    return this.y <= BALL_RADIUS && this.dy <= 0;
  },
  shouldBounceFromTBottomWall: function () {
    return this.y + BALL_RADIUS >= CANVAS_HEIGHT && this.dy > 0;
  },
  bounceFromWall: function () {
    this.dy = -this.dy;
  },
  bounceFromPaddle: function () {
    this.dx = -this.dx;
  },
  moveToStart: function () {
    this.x = BALL_START_POS_X;
    this.y = BALL_START_POS_Y;
  },
  isOutsideOnRightWall: function () {
    return this.x > CANVAS_WIDTH - BALL_RADIUS;
  },
  isOutsideOnLeftWall: function () {
    return this.x + BALL_RADIUS < 0;
  },
  isOnTheSameHeightAsPaddle(paddleY) {
    return isInBetween(this.y, paddleY, paddleY + PADDLE_HEIGHT);
  },
  shouldBounceFromRightPaddle: function () {
    return (
      this.dx > 0 &&
      isInBetween(
        this.x + BALL_RADIUS,
        PADDLE_P2_POS_X,
        PADDLE_P2_POS_X + PADDLE_WIDTH
      ) &&
      this.isOnTheSameHeightAsPaddle(p2PaddleY)
    );
  },
  shouldBounceFromLeftPaddle: function () {
    return (
      this.dx < 0 &&
      isInBetween(
        this.x - BALL_RADIUS,
        PADDLE_P1_POS_X,
        PADDLE_P1_POS_X + PADDLE_WIDTH
      ) &&
      this.isOnTheSameHeightAsPaddle(p1PaddleY)
    );
  },
};

function Player(name) {
  // This function is a constructor (factory) for player objects
  return {
    name: name,
    points: 0,
    paddleY: PADDLE_START_POS_Y,
  };
}

const p1 = Player("Łukasz");
const p2 = Player("Maciej");

console.log(p1);
console.log(p2);

// Game state
let ballX = BALL_START_POS_X; // strart position: ;
let ballY = BALL_START_POS_Y; // start position: ;
let ballDX = BALL_START_DIRECTION_X; // ball direction X
let ballDY = BALL_START_DIRECTION_Y; // ball direction Y
let p1PaddleY = PADDLE_START_POS_Y; // p1 paddle start position Y
let p2PaddleY = PADDLE_START_POS_Y; // p2 paddle start position Y
let p1Points = 0; // p1 points
let p2Points = 0; // p2 points
let p1Action = PADDLE_ACTION_STOP; // starting paddle action
let p2Action = PADDLE_ACTION_STOP; // starting paddle action
let gamePaused = false;

function drawPaddle(posX, posY) {
  ctx.fillRect(posX, posY, PADDLE_WIDTH, PADDLE_HEIGHT);
}

function drawPoints(text, posX, posY) {
  ctx.fillText(text, posX, posY);
}

function drawBall(posX, posY, r) {
  ctx.beginPath();
  ctx.arc(posX, posY, r, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
}

function clearCanvas() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_WIDTH);
}

// drawing paddles
drawPaddle(PADDLE_P1_POS_X, PADDLE_START_POS_Y);
drawPaddle(PADDLE_P2_POS_X, PADDLE_START_POS_Y);

// drawing text
drawPoints("5", POINT_BOARD_P1_POS_X, POINT_BOARD_POS_Y);
drawPoints("7", POINT_BOARD_P2_POS_X, POINT_BOARD_POS_Y);

// drawing ball
drawBall(BALL_START_POS_X, BALL_START_POS_Y, BALL_RADIUS);

// Drawing accual state
function drawState() {
  clearCanvas();

  drawPoints(p1Points.toString(), POINT_BOARD_P1_POS_X, POINT_BOARD_POS_Y);
  drawPoints(p2Points.toString(), POINT_BOARD_P2_POS_X, POINT_BOARD_POS_Y);

  drawPaddle(PADDLE_P1_POS_X, p1PaddleY);
  drawPaddle(PADDLE_P2_POS_X, p2PaddleY);

  drawBall(ball.x, ball.y, BALL_RADIUS);
}

function coerceIn(val, min, max) {
  return Math.max(Math.min(val, max), min);
}

// this funtction stops paddle at the y end position (top and bottom)
function coercePaddle(paddleY) {
  const minPaddleY = 0;
  const maxPaddleY = CANVAS_HEIGHT - PADDLE_HEIGHT;

  return coerceIn(paddleY, minPaddleY, maxPaddleY);
}

function movePaddles() {
  const yMin = 0;
  const yMax = CANVAS_HEIGHT - PADDLE_HEIGHT;

  if (p1Action === PADDLE_ACTION_UP) {
    p1PaddleY = coercePaddle(p1PaddleY - PADDLE_STEP, yMin, yMax);
  } else if (p1Action === PADDLE_ACTION_DOWN) {
    p1PaddleY = coercePaddle(p1PaddleY + PADDLE_STEP, yMin, yMax);
  }

  if (p2Action === "up") {
    p2PaddleY = coercePaddle(p2PaddleY - PADDLE_STEP, yMin, yMax);
  } else if (p2Action === "down") {
    p2PaddleY = coercePaddle(p2PaddleY + PADDLE_STEP, yMin, yMax);
  }
}

function moveBall() {
  if (ball.shouldBounceFromTopWall() || ball.shouldBounceFromTBottomWall()) {
    ball.bounceFromWall();
  }
  if (ball.shouldBounceFromLeftPaddle() || ball.shouldBounceFromRightPaddle()) {
    ball.bounceFromPaddle();
  }
  if (ball.isOutsideOnLeftWall()) {
    ball.moveToStart();
    p2Points++;
  } else if (ball.isOutsideOnRightWall()) {
    ball.moveToStart();
    p1Points++;
  }

  ball.moveByStep();
  // moveBallByStep();
}

function updateState() {
  //code tu update state
  moveBall();
  movePaddles();
}

window.addEventListener("keydown", function (event) {
  if (event.code === P1_BUTTON_UP) {
    p1Action = PADDLE_ACTION_UP;
  } else if (event.code === P1_BUTTON_DOWN) {
    p1Action = PADDLE_ACTION_DOWN;
  }

  if (event.code === P2_BUTTON_UP) {
    p2Action = PADDLE_ACTION_UP;
  } else if (event.code === P2_BUTTON_DOWN) {
    p2Action = PADDLE_ACTION_DOWN;
  }
});
window.addEventListener("keyup", function (event) {
  let code = event.code;
  if (
    (code === P1_BUTTON_UP && p1Action === PADDLE_ACTION_UP) ||
    (code === P1_BUTTON_DOWN && p1Action === PADDLE_ACTION_DOWN)
  ) {
    p1Action = PADDLE_ACTION_STOP;
  } else if (
    (code === P2_BUTTON_UP && p2Action === PADDLE_ACTION_UP) ||
    (code === P2_BUTTON_DOWN && p2Action === PADDLE_ACTION_DOWN)
  ) {
    p2Action = PADDLE_ACTION_STOP;
  }
});

window.addEventListener("keydown", function (event) {
  let code = event.code;
  if (code === PAUSE_BUTTON) {
    gamePaused = !gamePaused; // this sets opposite boolean just like toggle in classList
  }
});

function udpdateAndDrawState() {
  if (!gamePaused) {
    updateState();
    drawState();
  }
}

setInterval(udpdateAndDrawState, STATE_CHANGE_INTERVAL);
