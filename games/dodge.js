const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let lives = 3;
let gameOver = false;
let isPaused = false;

const playerSVG = new Image();
playerSVG.src = "Player.svg";

const plasticSVG = new Image();
plasticSVG.src = "Plastic.svg";

const player = {
  width: 64,
  height: 64,
  x: canvas.width / 2 - 32,
  y: canvas.height - 80,
  speed: 6,
  dx: 0,
  facing: "right"
};

const plastics = [];

function addPlastic() {
  const x = Math.random() * (canvas.width - 40) + 20;
  const baseSpeed = 4 + Math.random() * 2;
  const difficultyMultiplier = 1 + score / 50; 
  plastics.push({
    x: x,
    y: -40,
    width: 40,
    height: 40,
    speed: baseSpeed * difficultyMultiplier,
  });
}

function drawBackground() {
  ctx.fillStyle = "#f5f0e1";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawPlayer() {
  ctx.save();
  if (player.facing === "left") {
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
    ctx.scale(-1, 1);
    ctx.translate(-(player.x + player.width / 2), -(player.y + player.height / 2));
  }
  ctx.drawImage(playerSVG, player.x, player.y, player.width, player.height);
  ctx.restore();
}

function drawPlastics() {
  plastics.forEach(p => {
    ctx.drawImage(plasticSVG, p.x, p.y, p.width, p.height);
  });
}

function movePlayer() {
  player.x += player.dx;
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

function movePlastics() {
  plastics.forEach(p => {
    p.y += p.speed;
  });
  for (let i = plastics.length - 1; i >= 0; i--) {
    if (plastics[i].y > canvas.height) {
      plastics.splice(i, 1);
      if (!gameOver) {
        score++;
        avoidedCount++;
      }
    }
  }
}

function detectCollision() {
  for (let i = plastics.length - 1; i >= 0; i--) {
    const p = plastics[i];
    if (
      player.x < p.x + p.width &&
      player.x + player.width > p.x &&
      player.y < p.y + p.height &&
      player.y + player.height > p.y
    ) {
      plastics.splice(i, 1);
      lives--;
      flashScreenRed();
      if (lives <= 0) {
        gameOver = true;
      }
      break;
    }
  }
}

function drawLives() {
  const heart = "❤️";
  let hearts = "";
  for (let i = 0; i < lives; i++) hearts += heart + " ";
  ctx.fillStyle = "#333";
  ctx.font = "20px Arial";
  ctx.textAlign = "left";
  ctx.fillText(`Lives: ${hearts}`, 10, 60);
}

function drawGameOverScreen() {
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#fff";
  ctx.font = "48px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 40);

  ctx.font = "24px Arial";
  ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2);

  const btnWidth = 150;
  const btnHeight = 40;
  const btnX = canvas.width / 2 - btnWidth / 2;
  const btnY = canvas.height / 2 + 40;

  ctx.fillStyle = "#007BFF";
  ctx.fillRect(btnX, btnY, btnWidth, btnHeight);

  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText("Play Again", canvas.width / 2, btnY + 27);
}

function restartGame() {
  plastics.length = 0;
  player.x = canvas.width / 2 - 32;
  score = 0;
  lives = 3;
  gameOver = false;
  startTime = Date.now();
  loop();
}

let flashTimer = 0;
function flashScreenRed() {
  flashTimer = 10;
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" || e.key === "a") {
    player.dx = -player.speed;
    player.facing = "left";
  } else if (e.key === "ArrowRight" || e.key === "d") {
    player.dx = player.speed;
    player.facing = "right";
  }
});

document.addEventListener("keyup", e => {
  if (
    e.key === "ArrowLeft" ||
    e.key === "ArrowRight" ||
    e.key === "a" ||
    e.key === "d"
  ) {
    player.dx = 0;
  }
});

canvas.addEventListener("click", e => {
  if (gameOver) {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const btnWidth = 150;
    const btnHeight = 40;
    const btnX = canvas.width / 2 - btnWidth / 2;
    const btnY = canvas.height / 2 + 40;

    if (
      clickX >= btnX &&
      clickX <= btnX + btnWidth &&
      clickY >= btnY &&
      clickY <= btnY + btnHeight
    ) {
      restartGame();
    }
  }
});

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !gameOver) {
    isPaused = !isPaused;
    if (!isPaused) requestAnimationFrame(loop);
  }
});

function drawPauseScreen() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ffffff";
  ctx.font = "42px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Pausa", canvas.width / 2, canvas.height / 2 - 20);

  ctx.font = "20px Arial";
  ctx.fillText("Press SPACE to Continue", canvas.width / 2, canvas.height / 2 + 20);
}

let frameCount = 0;
let avoidedCount = 0;
let startTime = Date.now();

const ecoTips = [
  "Always recycle plastic to help the planet!",
  "Avoid single-use products and choose reusable alternatives.",
  "Take part in local clean-up events for the sea and rivers.",
  "Reduce your use of disposable plastic.",
  "Support policies to reduce plastic use.",
  "Use water bottles instead of plastic bottles.",
];

function updateDifficulty() {
  if (score < 10) return "Easy";
  else if (score < 30) return "Average";
  else return "Hard";
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function updateInfoUI() {
  document.getElementById("difficulty").textContent = updateDifficulty();
  document.getElementById("timePlayed").textContent = formatTime(Date.now() - startTime);
  document.getElementById("plasticsAvoided").textContent = avoidedCount;
}

let ecoTipIndex = 0;
function updateEcoTip() {
  ecoTipIndex = (ecoTipIndex + 1) % ecoTips.length;
  document.getElementById("ecoTip").textContent = ecoTips[ecoTipIndex];
}
setInterval(updateEcoTip, 15000);


function updateDifficulty() {
  if (score < 20) return "Easy";
  else if (score < 50) return "Average";
  else return "Hard";
}

function loop() {
  if (isPaused) {
    drawPauseScreen();
    return;
  }

  drawBackground();
  movePlayer();
  movePlastics();
  drawPlayer();
  drawPlastics();
  detectCollision();

  if (flashTimer > 0) {
    ctx.fillStyle = `rgba(255,0,0,${flashTimer / 10 * 0.5})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    flashTimer--;
  }

  ctx.fillStyle = "#333";
  ctx.font = "20px Arial";
  ctx.textAlign = "left";
  ctx.fillText(`Score: ${score}`, 10, 30);
  drawLives();

  updateInfoUI();

  if (gameOver) {
    drawGameOverScreen();
    return;
  }

  frameCount++;
  if (frameCount % 60 === 0) {
    addPlastic();
  }

  let plasticFrequency;
  const difficulty = updateDifficulty();

  if (difficulty === "Easy") plasticFrequency = 60;       // una bottiglia al secondo
  else if (difficulty === "Average") plasticFrequency = 40; // ogni ~0.66s
  else plasticFrequency = 25;                              // ogni ~0.42s

  if (frameCount % plasticFrequency === 0) {
    addPlastic();
  }


  requestAnimationFrame(loop);
}

// Inizia il gioco solo al click sul pulsante "Start"
playerSVG.onload = () => {
  plasticSVG.onload = () => {
    document.getElementById("startBtn").addEventListener("click", () => {
      document.getElementById("startOverlay").style.display = "none";
      startTime = Date.now();
      loop();
    });
  };
};

document.getElementById("saveBtn").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `microplastic_score_${score}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
});
