
let valueSlider;

let drehwinkel = 0;
let flipSpeed = 5;

function setup() {
  createCanvas(windowWidth, windowHeight);
  valueSlider = createSlider(-10, 38, 9);
  valueSlider.position(width - valueSlider.width - 20, height - valueSlider.height - 20);
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

  background(0, 0, 0, 10);


  let alpha = map(inputValue, inputMin, inputMax, outputMin, outputMax, 0, 255);

//Rotation und Zeichnen der Karte
  push();
  rotateY(drehwinkel);

  rect(0, 0, 200, 400);
  fill(191, 239, 255, alpha);
  
  pop();


  drehwinkel = drehwinkel + 1;
}