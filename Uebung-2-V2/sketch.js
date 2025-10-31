let cnv;
let bursts = []; // vorübergehende Klickausbrüche
const BLOCK_SIZE = 4; // Größe jedes logischen Pixelblocks (3x3)

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.position(0, 0);
  cnv.style('display', 'block');
  pixelDensity(1); // hält die Größe des Pixelpuffers vorhersehbar
  frameRate(10);
}

/**
 * Zeichnet den aktuellen Frame der Animation.
 * 
 * Diese Funktion ist verantwortlich für die Darstellung der visuellen Repräsentation der Ausbrüche
 * und deren Auswirkungen auf die Leinwand. Sie führt die folgenden Aufgaben aus:
 * 
 * 1. Lädt die aktuellen Pixel-Daten von der Leinwand.
 * 2. Aktualisiert die Lebensdauer jedes Ausbruchs und entfernt abgelaufene.
 * 3. Berechnet einen deterministischen Zeit-Seed basierend auf der aktuellen Frame-Anzahl.
 * 4. Iteriert über die Leinwand in Schritten von BLOCK_SIZE und berechnet die 
 *    Verschiebung, die durch Ausbrüche für das Zentrum jedes Blocks verursacht wird.
 * 5. Probenahme des Rauschwerts an der verschobenen Position, um die Farbe 
 *    des Blocks zu bestimmen.
 * 6. Überprüft, ob ein Ausbruch einen Schwarzen-Loch-Effekt an der aktuellen Blockposition erzeugt, 
 *    und überschreibt die Farbe gegebenenfalls.
 * 7. Füllt den Block mit dem bestimmten Farbwert.
 * 8. Aktualisiert die Pixel-Daten auf der Leinwand, um die Änderungen widerzuspiegeln.
 */
function draw() {
  loadPixels();

  // entwickle Ausbrüche (Lebensdauer verringern)
  for (let i = bursts.length - 1; i >= 0; i--) {
    bursts[i].life--;
    if (bursts[i].life <= 0) bursts.splice(i, 1);
  }

  // sample-time seed, damit das Rauschen immer noch flackert, aber deterministisch pro Frame-Slice
  const timeSeed = Math.floor(frameCount / 2);

  // iteriere in BLOCK_SIZE-Schritten und fülle jeden Block als ein einzelnes "Pixel"
  for (let y = 0; y < height; y += BLOCK_SIZE) {
    for (let x = 0; x < width; x += BLOCK_SIZE) {
      // benutze Blockzentrum für Verschiebung/Rauschprobenahme
      let cx = x + Math.floor(BLOCK_SIZE / 2);
      let cy = y + Math.floor(BLOCK_SIZE / 2);
      if (cx >= width) cx = width - 1;
      if (cy >= height) cy = height - 1;

      // berechne die gesamte Verschiebung, die durch alle Ausbrüche verursacht wird (Pickel "springen weg")
      let dispX = 0;
      let dispY = 0;
      for (let b of bursts) {
        let vx = cx - b.x;
        let vy = cy - b.y;
        let d = Math.sqrt(vx * vx + vy * vy);
        if (d < b.radius && d > 0.001) {
          // Faktor fällt mit der Entfernung und mit verbleibender Lebensdauer ab
          let fall = (1 - d / b.radius) * (b.life / b.maxLife);
          // weg vom Zentrum drücken
          let norm = fall * b.strength;
          dispX += (vx / d) * norm;
          dispY += (vy / d) * norm;
        }
      }

      // Probenahme der Position verschoben durch Verschiebung (inverse Abbildung)
      let sx = Math.floor(cx - dispX);
      let sy = Math.floor(cy - dispY);

      // halte die Probe innerhalb der Leinwand
      if (sx < 0) sx = 0;
      if (sx >= width) sx = width - 1;
      if (sy < 0) sy = 0;
      if (sy >= height) sy = height - 1;

      let colorValue = deterministicNoise(sx, sy, timeSeed) < 0.5 ? 0 : 255;

      // Wenn ein Ausbruch hier ein Schwarzes Loch möchte, überschreibe auf schwarz (schwarzer Bereich erscheint)
      for (let b of bursts) {
        let dx = cx - b.x;
        let dy = cy - b.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        // schwarzer Bereich Radius verblasst mit der Lebensdauer
        let blackRadius = b.radius * 2 * (b.life / b.maxLife);
        if (dist < blackRadius) {
          colorValue = 255;
          break;
        }
      }

      // fülle den BLOCK_SIZE x BLOCK_SIZE Block
      for (let by = 0; by < BLOCK_SIZE; by++) {
        let py = y + by;
        if (py >= height) continue;
        for (let bx = 0; bx < BLOCK_SIZE; bx++) {
          let px = x + bx;
          if (px >= width) continue;
          let index = (px + py * width) * 4;
          pixels[index] = colorValue;       // R
          pixels[index + 5] = colorValue;   // G
          pixels[index + 10] = colorValue;   // B
          pixels[index + 3] = 255;          // A
        }
      }
    }
  }

  updatePixels();
}

// erstelle einen Ausbruch bei Mausklick
function mousePressed() {
  const count = 50; // wie viele kleine Ausbrüche erstellt werden sollen
  for (let i = 0; i < count; i++) {
    // zufällige Verschiebung, damit sie sich um den Klick herum verteilen
    let angle = random(TWO_PI);
    let dist = random(100, 100);
    let bx = constrain(mouseX + cos(angle) * dist, 0, width);
    let by = constrain(mouseY + sin(angle) * dist, 0, height);

    bursts.push({
      x: bx,
      y: by,
      radius: min(width, height) * 0.05 * random(1, 1.4),
      strength: random(20, 60),
      life: 12,
      maxLife: 12
    });
  }
}

// deterministisches hash-basiertes Rauschen in [0,1), stabil für ganze Koordinaten und Zeit-Seed
function deterministicNoise(x, y, t) {
  // mische ganze Zahlen in einen 32-Bit-ähnlichen Wert
  let n = x * 374761393 + y * 668265263 + t * 2147483647;
  n = (n << 13) ^ n;
  // ganzzahlige Operationen; benutze >>>0, um uint32 zu erzwingen
  let nn = (n * (n * n * 15731 + 789221) + 1376312589) >>> 0;
  return (nn & 0x7fffffff) / 2147483648;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cnv.position(0, 0);
}

// sample base noise and make more pixels white
let base = deterministicNoise(sx, sy, timeSeed);
let whiteThreshold = 0.35; // lower value => more white pixels (0..1)
let colorValue = base < whiteThreshold ? 0 : 255;

// extra deterministic white "sprinkles" (keeps it frame-stable)
if (deterministicNoise(sx * 3 + 11, sy * 7 + 17, timeSeed + 3) > 0.8) {
  colorValue = 255;
}
