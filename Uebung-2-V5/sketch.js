/*function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);*/

 /* for (let i = 0; i < 10; i++) {
    let x = i * 40 + 20; // Calculate x position
    fill(0); // Black fill
    stroke(255); // White stroke
    ellipse(x, 200, 30); // Draw ellipse
  }
}
for (let j = 0; j < 10; j++) {
   let x = i * 40 + 20;
   let y = j * 40 + 20;
   let size = 30;

   if ((i + j) % 2 === 0) {
     fill(0);
   } else {
     fill(255);
   }
   ellipse(x, y, size);
 }
}*/


/*

//Slider für Hintergrundfarbe
let sliderFarbe;

//Slider für Eckenradius
let sliderEcken;


function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  noStroke();

  //Slider mit Bereich und Startwert
  sliderFarbe = createSlider(0, 100, 0);
  sliderFarbe.position(20, 50);

  sliderEcken = createSlider(0, 15, 0);
  sliderEcken.position(20, 100);

}

function draw() {

  //Aktuelle Werte der Slider lesen
  let farbe = sliderFarbe.value();
  let radius = sliderEcken.value();

  //Hintergrundfarbe von Schwarz zu Weiss mappen
  let grau = map(farbe, 0, 100, 0, 255);
  background(grau);

  //Abstand der Maus zur Mitte
  let abstandX = (mouseX - width / 2) / 10;
  let abstandY = (mouseY - height / 2) / 10;

  //Farben der Formen definieren
  let blau = color(0, 200, 255);
  let pink = color(30, 50, 130);


// Formen in wechselnder Farbe gelistet
for (let i = 0; i < 6; i++) {
  // 1. Color: Alternates based on whether 'i' is even or odd
  if (i % 2 === 0) {
    fill(blau); // For i = 0, 2, 4 (even)
  } else {
    fill(pink); // For i = 1, 3, 5 (odd)
  }

  // 2. Position: Shifts by a multiple of abstandX and abstandY
  let xPos = width / 2 + abstandX * i;
  let yPos = height / 2 + abstandY * i;

  // 3. Size: Starts at 300 and decreases by 50 * i
  let size = 300 - 50 * i;

  // Draw the rectangle
  rect(xPos, yPos, size, size, radius);
}

  //Beschriftungen der Slider
  if (grau < 128) {
    fill(255); // heller Text auf dunklem Hintergrund
  } else {
    fill(50);   // dunkler Text auf hellem Hintergrund
  }

  textSize(12);
  text('Hintergrundfarbe', 160, 62);
  text('Eckenradius', 160, 112);


}
//Canvas an die Fenstergrösse anpassen
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}