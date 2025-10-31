// ...existing code...
let lineMin = 0;
let lineColor; //variable für random Farbe

let fixedLines = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Fixe Linien
  for (let i = 0; i < 20; i++) {
    fixedLines.push(random(0, height));
  }
  
  // Random farbe bei Refresh
  lineColor = color(random(255), random(255), random(240));
}

function draw() {
  background(0);

  let inputValue = mouseY;
  let inputMin = 0;
  let inputMax = height; // benutze canvas height statt windowHeight

  let linePosition = map(inputValue, inputMin, inputMax, lineMin, height);

  // Hauptlinie
  stroke(255);
  strokeWeight(11);
  line(0, linePosition, width, linePosition); 

  // Parameter für Nähe / Sprung
  let proximity = 80;   // Abstand, bei dem Linien reagieren
  let jumpAmount = 500;  // maximale Verschiebung

  // fixe Linien
  for (let i = 0; i < fixedLines.length; i++) {
    let y = fixedLines[i];

    // nur einmalige Nähe-Prüfung und Verschiebung (vor dem Zeichnen)
    if (abs(mouseY - y) < proximity) {
      y += random(-jumpAmount, jumpAmount);
      y = constrain(y, 0, height);
      fixedLines[i] = y;
    }

    stroke(lineColor);
    strokeWeight(4);  
    line(0, y, width, y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}