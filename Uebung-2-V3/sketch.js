let drehwinkel = 45;
function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  rectMode(CENTER);
  noStroke(); 
}

function draw() {
  background(255,193,193,10);

  push();
  //Koordinatensystem in die Mitte des Canvas verschieben
  translate(width / 2, height / 2);
  rotate(-5*drehwinkel);
  fill(191,239,255);
  rect(0,0, 400, 400);
  pop(); //Rotation und Translation zurücksetzen 

  push();
  //Koordinatensystem in die Mitte des Canvas verschieben
  translate(width / 2, height / 2);
  rotate(2*drehwinkel);
  fill(72,61,139);
  circle(0,0,20);
  pop(); //Rotation und Translation zurücksetzen 


  drehwinkel = drehwinkel +1;
}
