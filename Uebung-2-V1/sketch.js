let posX = -50;
let posY = 0;

let treshold;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB, 255);
  noStroke();

  describe(
    'A diagonal green to red gradient from bottom-left to top-right with shading transitioning to black at top-left corner.'
  );
  treshold = width / 2;
}

function drawGradient() {
  for (let x = 0; x < width; x++) {
    let t = x / (width - 1);
    let r = lerp(255, 0, t);
    let g = lerp(0, 255, t);
    stroke(r, g, 0);
    line(x, 0, x, height);
  }
}

function draw() {
  drawGradient();

  if (posX + 25 < treshold) {
    fill(255, 0, 0); // red
  } else {
    fill(0, 255, 0); // green
  }

  // Set no stroke for the circle
  noStroke();

  if (frameCount % 10 == 0) {
    posY = random(-10, 10);
  }

  circle(posX, height / 2 + posY, 50, 50);

  let speed = 2;
  posX += speed;
  if (posX > width) {
    posX = -50;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  treshold = width / 2;
}
