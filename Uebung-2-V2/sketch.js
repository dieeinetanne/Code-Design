let cnv;
let bursts = []; // transient click bursts
const BLOCK_SIZE = 3; // size of each logical pixel block (3x3)

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.position(0, 0);
  cnv.style('display', 'block');
  pixelDensity(1); // keep pixel buffer size predictable
  frameRate(10);
}


function draw() {
  loadPixels();

  // evolve bursts (decrease life)
  for (let i = bursts.length - 1; i >= 0; i--) {
    bursts[i].life--;
    if (bursts[i].life <= 0) bursts.splice(i, 1);
  }

  // sample-time seed so the noise still flickers but deterministically per frame-slice
  const timeSeed = Math.floor(frameCount / 2);

  // iterate in BLOCK_SIZE steps and fill each block as a single "pixel"
  for (let y = 0; y < height; y += BLOCK_SIZE) {
    for (let x = 0; x < width; x += BLOCK_SIZE) {
      // use block center for displacement/noise sampling
      let cx = x + Math.floor(BLOCK_SIZE / 2);
      let cy = y + Math.floor(BLOCK_SIZE / 2);
      if (cx >= width) cx = width - 1;
      if (cy >= height) cy = height - 1;

      // compute total displacement caused by all bursts (pimples "jump away")
      let dispX = 0;
      let dispY = 0;
      for (let b of bursts) {
        let vx = cx - b.x;
        let vy = cy - b.y;
        let d = Math.sqrt(vx * vx + vy * vy);
        if (d < b.radius && d > 0.001) {
          // factor falls off with distance and with remaining life
          let fall = (1 - d / b.radius) * (b.life / b.maxLife);
          // push away from the center
          let norm = fall * b.strength;
          dispX += (vx / d) * norm;
          dispY += (vy / d) * norm;
        }
      }

      // sample position shifted by displacement (inverse mapping)
      let sx = Math.floor(cx - dispX);
      let sy = Math.floor(cy - dispY);

      // keep sample inside canvas
      if (sx < 0) sx = 0;
      if (sx >= width) sx = width - 1;
      if (sy < 0) sy = 0;
      if (sy >= height) sy = height - 1;

      let colorValue = deterministicNoise(sx, sy, timeSeed) < 0.5 ? 0 : 255;

      // If any burst wants a black hole here, override to black (black area appears)
      for (let b of bursts) {
        let dx = cx - b.x;
        let dy = cy - b.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        // black area radius fades with life
        let blackRadius = b.radius * 2 * (b.life / b.maxLife);
        if (dist < blackRadius) {
          colorValue = 0;
          break;
        }
      }

      // fill the BLOCK_SIZE x BLOCK_SIZE block
      for (let by = 0; by < BLOCK_SIZE; by++) {
        let py = y + by;
        if (py >= height) continue;
        for (let bx = 0; bx < BLOCK_SIZE; bx++) {
          let px = x + bx;
          if (px >= width) continue;
          let index = (px + py * width) * 4;
          pixels[index] = colorValue;       // R
          pixels[index + 1] = colorValue;   // G
          pixels[index + 2] = colorValue;   // B
          pixels[index + 3] = 255;          // A
        }
      }
    }
  }

  updatePixels();
}

// create a burst on mouse click
function mousePressed() {
  const count = 50; // how many small bursts to create
  for (let i = 0; i < count; i++) {
    // random offset so they spread out around the click
    let angle = random(TWO_PI);
    let dist = random(40, 40);
    let bx = constrain(mouseX + cos(angle) * dist, 0, width);
    let by = constrain(mouseY + sin(angle) * dist, 0, height);

    bursts.push({
      x: bx,
      y: by,
      radius: min(width, height) * 0.05 * random(0.6, 1.4),
      strength: random(20, 60),
      life: 12,
      maxLife: 12
    });
  }
}

// deterministic hash-based noise in [0,1), stable for integer coordinates and time seed
function deterministicNoise(x, y, t) {
  // mix integers into a 32-bit-ish value
  let n = x * 374761393 + y * 668265263 + t * 2147483647;
  n = (n << 13) ^ n;
  // integer-like operations; use >>>0 to force uint32
  let nn = (n * (n * n * 15731 + 789221) + 1376312589) >>> 0;
  return (nn & 0x7fffffff) / 2147483648;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cnv.position(0, 0);
}
