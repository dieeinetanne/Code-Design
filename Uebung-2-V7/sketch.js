const STROKE_MIN = 8; // Minimale Strichstärke - Definiert die dünnste Linie
const STROKE_MAX = 40; // Maximale Strichstärke - Definiert die dickste Linie

// Farb-Dunkelheitsfaktor abhängig von mouseY (oben hell, unten dunkler)
const SHADE_TOP = 1.0;   // Helligkeit oben
const SHADE_BOTTOM = 0.4; // Helligkeit unten (kleiner = dunkler)

const MIN_ANIM_SPEED = 0.02;     // Oben: stehen (0 pausiert) - Langsamste Animationsgeschwindigkeit
const MAX_ANIM_SPEED = 0.35;    // Unten: schneller (höher = schnellere Wellen) - Schnellste Animationsgeschwindigkeit
const PHASE_FROM_MOUSE = 0.05;  // Einfluss der Mausversetzung auf die Phase - Steuert wie stark die Mausposition die Wellenphase beeinflusst

function setup() {
  createCanvas(windowWidth, windowHeight); // Erstelle eine Leinwand in voller Fenstergröße - Initialisiert die Zeichenfläche
  background(0); // Setze den Hintergrund auf Schwarz - Erste Hintergrundfarbe beim Start
}

function draw() {
   background(0); 
  let inputValue = mouseY; // Hole den Y-Wert der Maus als Eingabewert - Speichert die vertikale Mausposition
  let inputMin = 0; // Minimale Eingabewert - Oberer Rand des Fensters
  let inputMax = windowHeight; // Maximale Eingabewert - Unterer Rand des Fensters


  let strokeWeightValue = map(inputValue, inputMin, inputMax, STROKE_MAX, STROKE_MIN); // Berechne die Strichstärke (umgekehrt) - Oben dick, unten dünn


  // Mittlere (grüne) Linie
    // Helligkeit der Linien abhängig von der vertikalen Mausposition
  const shade = map(mouseY, 0, windowHeight, SHADE_TOP, SHADE_BOTTOM);
  stroke(187 * shade, 255 * shade, 255 * shade); // Helligkeit mit Mausposition skalieren
 
  let offset = map(inputValue, inputMin, inputMax, 0, 300); // Berechne die Versetzung - Wandelt Mausposition in Versetzungswert um


  let x1_main = offset; // X-Koordinate für die linke Linie - Startpunkt links, abhängig von Mausposition
  let x2_main = windowWidth - offset; // X-Koordinate für die rechte Linie - Endpunkt rechts, abhängig von Mausposition

  // Oben breiter (kleinere Frequenz), unten dichter (größere Frequenz)
 // const FREQ_TOP = 0.02; // Niedrige Frequenz für obere Bildschirmhälfte - Breite, sanfte Wellen
  const FREQ_BOTTOM = 0.15; // Hohe Frequenz für untere Bildschirmhälfte - Enge, dichte Wellen
  // Phase setzt sich aus Zeit (frameCount) mit dynamischer Geschwindigkeit und Mausversetzung zusammen
  // Geschwindigkeit der Animation abhängig von der vertikalen Mausposition
  const animSpeed = MIN_ANIM_SPEED // Berechnet wie schnell sich die Wellen bewegen - Oben langsam, unten schnell
  const phase = frameCount * animSpeed + offset * PHASE_FROM_MOUSE; // Berechne Wellenphase - Kombiniert Zeit und Mausposition für Animationseffekt

  const randomOffset = map(mouseY, 0, windowHeight, 0, 100);
  drawWavyLine(x1_main, windowHeight - offset, x2_main, offset, max(6, strokeWeightValue * 0.6), phase); // Zeichne wellige Linie von links unten nach rechts oben - Amplitude ist 60% der Strichstärke, mindestens 6

}


function drawWavyLine(x1, y1, x2, y2, amplitude, phase) { // Funktion zum Zeichnen gewellter Linien - Parameter: Start/Endpunkte, Wellenhöhe, Wellendichte, Wellenverschiebung
    const segLen = dist(x1, y1, x2, y2); // Berechne die Distanz zwischen Start- und Endpunkt - Länge der Linie
    const steps = max(12, int(segLen / 8)); // Berechne Anzahl der Segmente - Mindestens 12, sonst abhängig von Linienlänge
    const dx = x2 - x1; // Differenz in X-Richtung - Horizontaler Abstand
    const dy = y2 - y1; // Differenz in Y-Richtung - Vertikaler Abstand
    const len = max(1e-6, sqrt(dx * dx + dy * dy)); // Berechne die Gesamtlänge - Verhindert Division durch 0
    const nx = -dy / len; // Normalvektor (x) - Vektor senkrecht zur Linie (horizontal)
    const ny = dx / len;  // Normalvektor (y) - Vektor senkrecht zur Linie (vertikal)

    const frequency = 0.2; // Berechne aktuelle Frequenz basierend auf Mausposition - Steuert Wellendichte

    line(x1, y1, x2, y2);
  
    beginShape(); // Beginne mit dem Zeichnen einer Form - Startet die Linie
    for (let i = 0; i <= steps; i++) { // Iteriere über alle Segmente - Durchläuft jeden Punkt der Linie
      const t = i / steps; // Berechne den Fortschritt (0 bis 1) - Position entlang der Linie
      const x = lerp(x1, x2, t); // Interpoliere X-Koordinate - Berechnet X-Position des aktuellen Punktes
      const y = lerp(y1, y2, t); // Interpoliere Y-Koordinate - Berechnet Y-Position des aktuellen Punktes
      const wobble = sin(t * segLen * frequency + phase) * amplitude; // Berechne die Wellenauslenkung - Sinus-Funktion erzeugt Wellenbewegung
      vertex(x + nx * wobble, y + ny * wobble); // Füge Vertex hinzu mit Wellenverschiebung - Zeichnet Punkt versetzt zur Grundlinie
    }
    endShape(); // Beende die Form - Schließt die Linie ab
  }