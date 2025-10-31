let drehwinkel = 45;
function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  rectMode(CENTER);
  noStroke(); 
}

function preload() {
  bild = loadImage('images/schoene-luftaufnahme-von-fronalpstock-bergen-in-der-schweiz-unter-dem-schoenen-rosa-und-blauen-himmel_181624-9315.jpg');
}

function draw() {
 image(bild,0,0,windowWidth,windowHeight);

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
