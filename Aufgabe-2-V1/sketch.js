const STROKE_MIN = 10;
const STROKE_MAX = 50;
const OFFSET_MIN = 0;
const OFFSET_MAX = 300;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(235);
}

function draw() {
  background(235);

  let inputValue = mouseY;
  let inputMin = 0;
  let inputMax = windowHeight;

  let greenStrokeWeight = map(inputValue, inputMin, inputMax, STROKE_MAX, STROKE_MIN);
  let pinkStrokeWeight = map(inputValue, inputMin, inputMax, STROKE_MIN, STROKE_MAX);
  let offset = map(inputValue, inputMin, inputMax, OFFSET_MIN, OFFSET_MAX);

  const Y_OFFSET_AMOUNT = windowHeight * 0.10; //Dublitzierte Linien werden versetzt

  let x1_main = offset;
  let x2_main = windowWidth - offset;

  // Wenn die Linien sich zusammenziehen (offset nahe OFFSET_MAX), werden sie rot
  let isClose = offset > OFFSET_MAX * 0.8;

  // Hauptlinie grün oder rot
  stroke(isClose ? color(255, 0, 0) : color(130, 100, 234));
  strokeWeight(greenStrokeWeight);

  let y1_mid_g = offset;
  let y2_mid_g = windowHeight - offset;
  line(x1_main, y1_mid_g, x2_main, y2_mid_g);

  // Hauptlinie pink oder rot
  stroke(isClose ? color(255, 0, 0) : color(255, 0, 255));
  strokeWeight(pinkStrokeWeight);

  let y1_mid_p = windowHeight - offset;
  let y2_mid_p = offset;
  line(x1_main, y1_mid_p, x2_main, y2_mid_p);

  // Obere grüne Linie oder rot
  stroke(isClose ? color(255, 0, 0) : color(100, 200, 255));
  strokeWeight(pinkStrokeWeight);

  let y1_up_g = y1_mid_g - Y_OFFSET_AMOUNT;
  let y2_up_g = y2_mid_g - Y_OFFSET_AMOUNT;
  line(x1_main, y1_up_g, x2_main, y2_up_g);

  // Obere pinke Linie oder rot
  stroke(isClose ? color(255, 0, 0) : color(150, 255, 255));
  strokeWeight(greenStrokeWeight);

  let y1_up_p = y1_mid_p - Y_OFFSET_AMOUNT;
  let y2_up_p = y2_mid_p - Y_OFFSET_AMOUNT;
  line(x1_main, y1_up_p, x2_main, y2_up_p);

  // Untere grüne Linie oder rot
  stroke(isClose ? color(255, 0, 0) : color(255, 165, 0));
  strokeWeight(pinkStrokeWeight);

  let y1_down_g = y1_mid_g + Y_OFFSET_AMOUNT;
  let y2_down_g = y2_mid_g + Y_OFFSET_AMOUNT;
  line(x1_main, y1_down_g, x2_main, y2_down_g);

  // Untere pinke Linie oder rot
  stroke(isClose ? color(255, 0, 0) : color(255, 120, 0));
  strokeWeight(greenStrokeWeight);

  let y1_down_p = y1_mid_p + Y_OFFSET_AMOUNT;
  let y2_down_p = y2_mid_p + Y_OFFSET_AMOUNT;
  line(x1_main, y1_down_p, x2_main, y2_down_p);
}