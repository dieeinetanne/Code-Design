let valueSlider;
let drehwinkel = 0;
let lastAnimationDuration = null; // cache to avoid resetting CSS every frame

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // slider erstellen
  valueSlider = createSlider(0, 100, 50); // 50 ist der Startwert des Sliders
  valueSlider.position(width - valueSlider.width - 400, height - valueSlider.height - 20);
  valueSlider.size(500); // Breite des Sliders
//stellt den Slider über das 3D Canvas
  valueSlider.style('z-index', '999');
  valueSlider.style('position', 'fixed');
  angleMode(DEGREES);

  // Marquee Struktur für kontinuierliche Textfüllung vorbereiten
  initMarquees();
}

function draw() {
  let inputValue = valueSlider.value();
  let inputMin = 50;
  let inputMax = 100;
  let outputMin = 0;
  let outputMax = 255;

  // Transparenter Hintergrund, damit der DOM-Text hinter dem Canvas sichtbar bleibt
  clear();
  let alpha = map(inputValue, inputMin, inputMax, outputMin, outputMax);

  // Animationsdauer basierend auf dem Schiebereglerwert
  // Je höher der Wert, desto kürzer die Dauer (schneller die Animation)
  //Text  miteinbezogen
  let durationSec = map(inputValue, 0, 100, 30, 6);

  // Berechnet die Animationsdauer und rundet sie auf 2 Dezimalstellen
  let rounded = Number(durationSec.toFixed(2)); 
  if (rounded !== lastAnimationDuration) {
    lastAnimationDuration = rounded;
    // Animationsdauer nur auf die Track-Elemente anwenden (verhindert ständiges Neustarten)
    const tracks = document.querySelectorAll('.marquee-track');
    tracks.forEach(track => {
      track.style.animationDuration = `${rounded}s`;
    });
  }

  // Farbe basierend auf dem Schiebereglerwert
  let r = map(inputValue, inputMin, inputMax, 50, 255);
  let g = map(inputValue, inputMin, inputMax, 100, 200);
  let b = map(inputValue, inputMin, inputMax, 150, 100);
  fill(r, g, b);

  // Oktaeder zeichnen 
  push();
  rotateY(drehwinkel);
  drawOctahedron(240); // Größe anpassen
  pop();

  drehwinkel += alpha * 0.1; // Geschwindigkeit der Drehung basierend auf dem Alphawert
}

//Oktaeder aus 8 Dreiecken
function drawOctahedron(s) {
  const top = [0, -s, 0];
  const bottom = [0, s, 0];
  const right = [s, 0, 0];
  const left = [-s, 0, 0];
  const front = [0, 0, s];
  const back = [0, 0, -s];

  stroke(255);
  strokeWeight(5);

  beginShape(TRIANGLES);
  // obere vier Flächen
  vertex(top[0], top[1], top[2]); vertex(right[0], right[1], right[2]); vertex(front[0], front[1], front[2]);
  vertex(top[0], top[1], top[2]); vertex(front[0], front[1], front[2]); vertex(left[0], left[1], left[2]);
  vertex(top[0], top[1], top[2]); vertex(left[0], left[1], left[2]); vertex(back[0], back[1], back[2]);
  vertex(top[0], top[1], top[2]); vertex(back[0], back[1], back[2]); vertex(right[0], right[1], right[2]);
  // untere vier Flächen
  vertex(bottom[0], bottom[1], bottom[2]); vertex(front[0], front[1], front[2]); vertex(right[0], right[1], right[2]);
  vertex(bottom[0], bottom[1], bottom[2]); vertex(left[0], left[1], left[2]); vertex(front[0], front[1], front[2]);
  vertex(bottom[0], bottom[1], bottom[2]); vertex(back[0], back[1], back[2]); vertex(left[0], left[1], left[2]);
  vertex(bottom[0], bottom[1], bottom[2]); vertex(right[0], right[1], right[2]); vertex(back[0], back[1], back[2]);
  endShape();
}

// Erstellt für jede Textzeile eine Track-Struktur mit zwei Kopien für nahtlosen Loop
function initMarquees() {
  const forwardSelectors = ['h1', '.foreward, .foreward2, .foreward3'];
  const reverseSelectors = ['h2', '.reward, .reward2, .reward3'];

  const makeTrack = (el, dirClass) => {
    if (el.querySelector('.marquee-track')) return; // schon initialisiert

    const text = el.textContent.trim();
    const track = document.createElement('span');
    track.className = `marquee-track ${dirClass}`;

    const copy1 = document.createElement('span');
    copy1.className = 'marquee-copy';
    copy1.textContent = text + ' ';

    const copy2 = document.createElement('span');
    copy2.className = 'marquee-copy';
    copy2.textContent = text + ' ';

    track.appendChild(copy1);
    track.appendChild(copy2);

    el.textContent = '';
    el.appendChild(track);
  };

  forwardSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => makeTrack(el, 'forward'));
  });
  reverseSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => makeTrack(el, 'reverse'));
  });
}
