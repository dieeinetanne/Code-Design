let valueSlider;

function setup() { 
  createCanvas(windowWidth, windowHeight);
  valueSlider = createSlider(-10, 38, 9);
  valueSlider.position(10, 10);
}


function draw() {

  let inputValue = valueSlider.value();

  let inputMin = -10;
  let inputMax = 38;

  let outputMin = 100;
  let outputMax = 220;

  let sizeMin = 0; 
  let sizeMax = 800;

  let strokeMin = 0;
  let strokeMax = 40;
  
  let outputValue = map(inputValue, inputMin, inputMax, outputMin, outputMax);
  let sizeGrowing = map(inputValue, inputMin, inputMax, sizeMin, sizeMax);
  let strokeGrowing = map(inputValue, inputMin, inputMax, strokeMin, strokeMax);
  let sizeShrinking = map(inputValue, inputMin, inputMax, sizeMax, sizeMin);
  let strokeShrinking = map(inputValue, inputMin, inputMax, strokeMax, strokeMin);

  background(outputValue);

  fill(200, 100, 0); 
  stroke(255); 
  strokeWeight(strokeGrowing); 
  ellipse(width - sizeGrowing / 2, sizeGrowing / 2, sizeGrowing, sizeGrowing);

  fill(100, 100, 0);  
  stroke(200, 200, 200);
  strokeWeight(strokeShrinking); 
  ellipse(sizeShrinking / 2, height - sizeShrinking / 2, sizeShrinking, sizeShrinking);
}
