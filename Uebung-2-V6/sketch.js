/*function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);

  //plan: durchmesser der ellipse abhängig von mausdistanz machen

  let durchmesser;
  let distanz = dist(mouseX, mouseY, width/2, height/2);
  //console.log(distanz);

  durchmesser = map(distanz,0,width/2, 10, 500);

  fill(50,50,50);
  ellipse(width/2, height/2, durchmesser, durchmesser);  
}*/

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  fill(30,200,50);
  noStroke();

  for (let i = 0; i < 10; i++) {
    //plan: y position ist abhängig von Distanz der maus zur mitte
    let distanz = dist(mouseX, mouseY, i * 200, height / 2);
    let yPos = map(distanz, 0, width, -300, 300);

      //Die Mausdistanz bezieht den durchmesser der Ellipsen mit ein
      //je näher desto größer  
      let d = map(distanz, 0, width, 300, 50);
      ellipse(i * 200, height / 2 - yPos, d, d);
  }

}

