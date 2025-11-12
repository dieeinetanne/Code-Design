let angle = 0;
let shapeIndex = 0; // 0 = Quadrat, 1 = Dreieck, 2 = Kreis, 3 = Stern

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
background(0);
}

function draw() {
  const size = map(mouseY, 0, height, 20, 1500);

  push();
  translate(width / 2, height / 2);
  rotate(angle);
  stroke(255, 255, 255, 120);
  strokeWeight(6);

  if (shapeIndex === 0) {
    //    background(0);
    fill(160, 120, 220, 120);
    rect(0, 0, size, size); // Quadrat
  } else if (shapeIndex === 1) {
     //   background(250);
    fill(255, 182, 193, 100); // Dreieck
    const R = size / Math.sqrt(3); // Umkreisradius
    const x2 = R * 0.8660254, y2 = R * 0.5; //
    triangle(0, -R, x2, y2, -x2, y2);
  } else if (shapeIndex === 2) {
      //  background(200);
    fill(173, 216, 230, 100); 
    ellipse(0, 0, size, size); // Kreis
  } else {
      //  background(150);
    fill(255, 255, 153, 100);
    drawStar(0, 0, size * 0.3, size * 0.6, 5); // Stern zeichnen
  }
  pop();

  angle += 0.08;
}

function mousePressed() {
  shapeIndex = (shapeIndex + 1) % 4; //Form wechseln
}

// Stern zeichnen
function drawStar(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = -PI / 2; a < TWO_PI - PI / 2; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
