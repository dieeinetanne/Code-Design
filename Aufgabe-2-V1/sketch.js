
let valueSlider;

let drehwinkel = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
valueSlider = createSlider(0, 100, 20);
valueSlider.position(width - valueSlider.width - 400, height - valueSlider.height - 20);
//den Slider verlängern
valueSlider.size(500);

  angleMode(DEGREES);
  rectMode(CORNER);
  noStroke();
}

function draw() {
//Slider
let inputValue = valueSlider.value();

  let inputMin = -10;
  let inputMax = 38;

  let outputMin = 0;
  let outputMax = 255;

  background(0, 0, 0, 255);


 let alpha = map(inputValue, inputMin, inputMax, outputMin, outputMax, 0, 255);

//Rotation und Zeichnen der Karte
  push();
  rotateY(drehwinkel);
  
//fill mit regenbogenfarben abhängig vom Sliderwert
  let r = map(inputValue, inputMin, inputMax, 255, 0);
  let g = map(inputValue, inputMin, inputMax, 0, 255);
  let b = map(inputValue, inputMin, inputMax, 0, 255);
  fill(r, g, b);
  
 // fill(191, 239, 255);

  //Zeichnet ein Rechtech welches mittig platziert ist
  rectMode(CENTER);
  rect(0, 0, 200, 400);
  
  pop();

//Drehung abhängig vom Sliderwert
  drehwinkel = drehwinkel + alpha * 0.1;
}