let durchmesser
durchmesser = 10

let valueSlider;

let drehwinkel = 45;

//zählt von 0 auf 100 und wieder zurück in einer Endlosschleife

function setup() {
  createCanvas(windowWidth, windowHeight);
  valueSlider = createSlider(-10, 38, 9);
  valueSlider.position(width - valueSlider.width - 20, height - valueSlider.height - 20);
  angleMode(DEGREES);
  rectMode(CENTER);
  noStroke();


  //zählt von 0 auf 100 und wieder zurück in einer Endlosschleife 
  frameRate(30);

  textSize(30);
  textAlign(CENTER);
}

function draw() {

  let inputValue = valueSlider.value();

  let inputMin = -10;
  let inputMax = 38;

  let outputMin = 0;
  let outputMax = 255;

  background(0, 0, 0, 10);
  let bgColor = map(inputValue, inputMin, inputMax, outputMin, outputMax);
  background(bgColor, 161,208,164);


  //rect1 blau mit transparenz abhängig vom sliderwert
  push();
  //Koordinatensystem in die Mitte des Canvas verschieben
  translate(width / 2, height / 2);

  //rotation des rechtecks automatisch in einem Loop von 0 bis 100
  rotate(-1 * drehwinkel);

  let alpha = map(inputValue, inputMin, inputMax, 0, 255);

  //Transparenz abhängig vom Sliderwert
  fill(191, 239, 255, alpha);
  stroke(255);
  strokeWeight(5);
  rect(0, 0, 400, 400);
  pop(); //Rotation und Translation zurücksetzen 



  //rect2 pink mit transparenz abhängig vom sliderwert
  push();
  //Koordinatensystem in die Mitte des Canvas verschieben
  translate(width / 2, height / 2);

  //rotation des rechtecks automatisch in einem Loop von 0 bis 100
  rotate(5 * drehwinkel);

  //Transparenz abhängig vom Sliderwert
  noFill();
  stroke(230,45,167, alpha);
  strokeWeight(5+inputValue);
  rect(0, 0, 400, 400);
  pop(); //Rotation und Translation zurücksetzen 

  drehwinkel = drehwinkel + 1;

  // Kreis in der Mitte zeichnen, ohne die globale Transformation dauerhaft zu verändern
  push();
  //Koordinatensystem in die Mitte des Canvas verschieben
  translate(width / 2, height / 2);
  fill(72,61,139-alpha);
  circle(0,0,50);
  pop();


  //textanzeige des frameCounts
  const textColor = constrain(255 - bgColor, 0, 255);
  fill(textColor);
    textAlign(RIGHT);
  //text des sliderwerts
  text("Sliderwert: " + alpha, windowWidth - 20, 50);
}
