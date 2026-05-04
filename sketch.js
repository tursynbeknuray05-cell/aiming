// --- IMAGES ---
let bgImg;
let targetImg;

// --- GAME STATE ---
let targets = [];
let score = 0;
let timeLeft = 30;
let running = false;

let lastSpawn = 0;
let lastSecond = 0;


function preload() {
  // Make sure these filenames match exactly
  bgImg = loadImage("bg watergun.png");
  targetImg = loadImage("target watergun.png");
}

function setup() {
  createCanvas(800, 600);
  noSmooth(); // keeps the bitmap look
  textFont("monospace");
}

function draw() {
  drawBackground();

  if (running) {
    updateGame();
    drawTargets();
    drawHUD();
    drawCrosshair(mouseX, mouseY);
  } else {
    drawOverlay();
  }
}

//
// BACKGROUND
//

function drawBackground() {
  background(0);

  let scaleFactor = max(
    width / bgImg.width,
    height / bgImg.height
  );

  let w = bgImg.width * scaleFactor;
  let h = bgImg.height * scaleFactor;

  let x = (width - w) / 2;
  let y = (height - h) / 2;

  image(bgImg, x, y, w, h);
}

//
// GAME LOOP
//

function updateGame() {
  let now = millis();

  // timer
  if (now - lastSecond > 1000) {
    timeLeft--;
    lastSecond = now;

    if (timeLeft <= 0) {
      running = false;
      targets = [];
    }
  }

  // spawn targets
  if (now - lastSpawn > 700 && targets.length < 3) {
  spawnTarget();
    spawnTarget();
    lastSpawn = now;
  }

  // move targets
  for (let t of targets) {
    t.x += t.speed;

    if (t.x < 40 || t.x > width - t.size - 40) {
      t.speed *= -1;
    }
  }
}

//
// TARGETS
//

function spawnTarget() {
  let size = random(65, 110);

  let spawnTop = 70;
  let spawnBottom = 220;

  targets.push({
    x: random(60, width - size - 60),
    y: random(spawnTop, spawnBottom),
    size: size,
    speed: random(2, 4) * (random() < 0.5 ? -1 : 1)
  });
}

function drawTargets() {
  for (let t of targets) {
    let ratio = targetImg.width / targetImg.height;
    let w = t.size;
    let h = t.size / ratio;

    image(targetImg, t.x, t.y, w, h);
  }
}

//
// INPUT
//

function mousePressed() {
  if (!running) {
    startGame();
    return;
  }

  let hit = false;

  for (let i = targets.length - 1; i >= 0; i--) {
    let t = targets[i];

    let ratio = targetImg.width / targetImg.height;
    let w = t.size;
    let h = t.size / ratio;

    let cx = t.x + w / 2;
    let cy = t.y + h / 2;

    let d = dist(mouseX, mouseY, cx, cy);

    if (d < min(w, h) * 0.42) {
      score += 10;
      targets.splice(i, 1);
      hit = true;
      break;
    }
  }

  if (!hit) {
    score = max(0, score - 5);
  }
}

function startGame() {
  score = 0;
  timeLeft = 30;
  running = true;
  targets = [];
  lastSpawn = millis();
  lastSecond = millis();
}

//
// UI
//

function drawHUD() {
  fill(255);
  noStroke();
  textSize(22);

  text("SCORE " + score, 30, 40);
  text("TIME " + timeLeft, width / 2, 40);
}

function drawOverlay() {
  fill(0, 200);
  rect(0, 0, width, height);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(40);

  if (timeLeft <= 0 && score > 0) {
    text("GAME OVER", width / 2, height / 2 - 40);
    textSize(22);
    text("CLICK TO PLAY AGAIN", width / 2, height / 2 + 20);
  } else {
    text("WATER GUN SHOOTER", width / 2, height / 2 - 40);
    textSize(22);
    text("CLICK TO START", width / 2, height / 2 + 20);
  }
}

//
// CROSSHAIR
//

function drawCrosshair(x, y) {
  push();
  translate(x, y);

  stroke(255);
  strokeWeight(2);
  noFill();

  circle(0, 0, 24);
  line(0, -16, 0, -7);
  line(0, 7, 0, 16);
  line(-16, 0, -7, 0);
  line(7, 0, 16, 0);

  fill(255);
  noStroke();
  rect(-2, -2, 4, 4);

  pop();
}