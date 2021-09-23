const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");
ctx.font = "30px Arial";

function drawPaddle(posX, posY) {
  ctx.fillRect(posX, posY, 20, 100);
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

// drawing paddles
drawPaddle(10, 100);
drawPaddle(770, 100);

// drawing text
drawPoints("5", 300, 50);
drawPoints("7", 500, 50);

// drawing ball
drawBall(200, 200, 10);
