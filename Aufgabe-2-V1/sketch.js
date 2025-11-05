
let valueSlider;

let drehwinkel = 0;
let flipSpeed = 5;

function setup() {
  createCanvas(windowWidth, windowHeight);
  valueSlider = createSlider(-10, 38, 9);
  valueSlider.position(width - valueSlider.width - 20, height - valueSlider.height - 20);
  angleMode(DEGREES);
  rectMode(CENTER);
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

  //flipcard effect
  //translate(width / 2, height / 2);

  //let alpha = map(inputValue, inputMin, inputMax, outputMin, outputMax, 0, 255);

//Rotation und Zeichnen der Karte
  push();
  rotateY(drehwinkel);

  }
  
  
  pop();

  // Flip frames
  //if (frameCount % 100 === 0) {
    //flipSpeed = -flipSpeed;
  //}
  
  drehwinkel = drehwinkel + flipSpeed;
}
