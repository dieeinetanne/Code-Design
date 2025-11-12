let points = [];

let growActive = false;
let growStartFrame = 0;
let growWeight = 60;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(0);

  const mx = mouseX - width / 2;
  const my = mouseY - height / 2;

  // Gespeicherte Punkte
  for (let p of points) {
    stroke(...p.col);
    strokeWeight(p.weight);
    point(p.x, p.y, p.z);
  }

  // Wachsender Punkt beim gedrückter Maus
  if (growActive) {
    growWeight = min(400, 30 + (frameCount - growStartFrame) * 4); // Wachstumsgeschwindigkeit/Rand
  } else {
    growWeight = 30;
  }

  stroke(255);
  strokeWeight(growWeight);
  point(mx, my, 0);

  // Mond
  const angle = frameCount * 0.05;
  const orbitRadius = 100;
  const moonX = mx + orbitRadius * cos(angle);
  const moonY = my + orbitRadius * sin(angle);
  stroke(200, 200, 80, 60);
  strokeWeight(60);
  point(moonX, moonY, 0);
}

let lastPlaced = null;

function mouseMoved() {
  if (growActive) return; // während Wachstum keine Punkte setzen

  const mx = mouseX - width / 2;
  const my = mouseY - height / 2;
  const spd = dist(mouseX, mouseY, pmouseX, pmouseY);
  const spacing = constrain(map(spd, 0, 50, 30, 140), 30, 140);

  if (!lastPlaced || dist(mx, my, lastPlaced.x, lastPlaced.y) >= spacing) {
    points.push({
      x: mx,
      y: my,
      z: 0,
      col: [random(255), random(255), random(255), 255],
      weight: 30
    });
    lastPlaced = { x: mx, y: my };
  }
}

function mousePressed() {
  growActive = true;
  growStartFrame = frameCount;
  growWeight = 30;
}

function mouseReleased() {
  // Finalen großen Punkt speichern
  const mx = mouseX - width / 2;
  const my = mouseY - height / 2;
  points.push({
    x: mx,
    y: my,
    z: 0,
    col: [random(255), random(255), random(255), 255],
    weight: growWeight
  });
  lastPlaced = { x: mx, y: my };
  growActive = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}