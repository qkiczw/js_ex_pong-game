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

const BALL_RADIUS = 15;
const BALL_START_POS_X = CANVAS_WIDTH / 2;
const BALL_START_POS_Y = CANVAS_HEIGHT / 2;
const BALL_START_SPEED_X = 4.5;
const BALL_START_SPEED_Y = 1.5;

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
