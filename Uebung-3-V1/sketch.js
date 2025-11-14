/**
 * HandPose Boilerplate mit ml5.js
 * 
 * Dieses Sketch erkennt Hände über die Webcam und zeichnet die erkannten Keypoints.
 * Es dient als Ausgangspunkt für eigene Hand-Tracking-Projekte.
 * 
 * Dokumentation: https://docs.ml5js.org/#/reference/handpose
 * 
 * Jede Hand hat 21 Keypoints (0-20):
 * - 0: Handgelenk
 * - 1-4: Daumen
 * - 5-8: Zeigefinger
 * - 9-12: Mittelfinger
 * - 13-16: Ringfinger
 * - 17-20: Kleiner Finger
 */

// Globale Variablen
let handpose;           // Das ml5.js HandPose-Modell
let video;              // Die Webcam
let hands = [];         // Array mit allen erkannten Händen
let ratio;              // Skalierungsfaktor zwischen Video und Canvas
let isModelReady = false; // Flag, ob das Modell geladen und Hände erkannt wurden

// Variablen für Klatschen-Erkennung
let previousDistance = 0;       // Vorherige Distanz zwischen den Händen
let clapThreshold = 50;         // Mindestablstand für Klatschen-Erkennung
let clapDetected = false;       // Flag für erkanntes Klatschen
let lastClapTime = 0;           // Zeit des letzten Klatschens (für Debouncing)
let clapDebounce = 500;         // Mindestzeit zwischen Klatsch-Events (ms)

// Variablen für Pinch-Erkennung (Zeigefinger-Daumen)
let pinchDetected = false;      // Flag für erkannte Pinch-Geste
let pinchThreshold = 50;        // Maximale Distanz für Pinch (in Pixeln)
let pinchStartTime = 0;         // Zeitpunkt when Pinch gestartet wurde
let circleSize = 100;           // Aktuelle Kreisgröße
let minCircleSize = 100;        // Minimum Kreisgröße
let maxCircleSize = 400;        // Maximum Kreisgröße
let growthRate = 0.1;           // Wachstumsgeschwindigkeit pro Millisekunde

/**
 * Lädt das HandPose-Modell vor dem Setup
 * Diese Funktion wird automatisch vor setup() ausgeführt
 */
function preload() {
  handpose = ml5.handPose();
}

/**
 * Initialisiert Canvas und Webcam
 */
function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1); // Performanceoptimierung
  
  // Webcam einrichten
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide(); // Versteckt das Standard-Video-Element
  
  // Berechne Skalierungsfaktor für Video-zu-Canvas-Anpassung
  ratio = width / video.width;
  
  // Starte Hand-Erkennung
  handpose.detectStart(video, gotHands);
}

/**
 * Hauptzeichnungs-Loop
 */
function draw() {
  background(0);

  // Spiegle die Darstellung horizontal (für intuitivere Interaktion)
  push();
  translate(width, 0);
  scale(-1, 1);

  //Zeige das Video (optional)
 // image(video, 0, 0, video.width * ratio, video.height * ratio);
  
  // Zeichne nur, wenn das Modell bereit ist und Hände erkannt wurden
  if (isModelReady) {
    drawHandPoints();
    
    // Pinch-Erkennung (Zeigefinger-Daumen)
    detectPinch();
    
    // Zeichne großen Kreis wenn Pinch erkannt wird
    if (pinchDetected) {
      drawBigCircle();
    }
    
    // HIER KÖNNEN EIGENE/Andere ZEICHNUNGEN Oder Interaktionen HINZUGEFÜGT WERDEN
    
  }
  
  pop();
}

/**
 * Callback-Funktion für HandPose-Ergebnisse
 * Wird automatisch aufgerufen, wenn neue Hand-Daten verfügbar sind
 * 
 * @param {Array} results - Array mit erkannten Händen
 */
function gotHands(results) {
  hands = results;
  
  // Setze Flag, sobald erste Hand erkannt wurde
  if (hands.length > 0) {
    isModelReady = true;
  }
}

/**
 * Zeichnet alle erkannten Hand-Keypoints
 * Jede Hand hat 21 Keypoints (siehe Kommentar oben)
 */
function drawHandPoints() {
  // Durchlaufe alle erkannten Hände (normalerweise max. 2)
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    
    // Durchlaufe alle 21 Keypoints einer Hand
    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];
      
      // Zeichne Keypoint als grüner Kreis
      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x * ratio, keypoint.y * ratio, 10);
    }
  }
}

/**
 * Erkennt Pinch-Gesten (Zeigefinger und Daumen nähern sich an)
 * Keypoint-Indizes: Daumen-Spitze = 4, Zeigefinger-Spitze = 8
 */
function detectPinch() {
  let currentPinchDetected = false;
  
  // Durchlaufe alle erkannten Hände
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    
    // Daumen-Spitze (Keypoint 4) und Zeigefinger-Spitze (Keypoint 8)
    let thumbTip = hand.keypoints[4];
    let indexTip = hand.keypoints[8];
    
    // Berechne Distanz zwischen Daumen und Zeigefinger
    let distance = dist(
      thumbTip.x * ratio, thumbTip.y * ratio,
      indexTip.x * ratio, indexTip.y * ratio
    );
    
    // Pinch erkannt wenn Distanz unter Schwellwert
    if (distance < pinchThreshold) {
      currentPinchDetected = true;
      break; // Mindestens eine Hand macht Pinch-Geste
    }
  }
  
  // Pinch-Status Management
  if (currentPinchDetected) {
    if (!pinchDetected) {
      // Pinch gerade gestartet
      pinchStartTime = millis();
      circleSize = minCircleSize;
    } else {
      // Pinch weiterhin aktiv - Kreis wachsen lassen
      let pinchDuration = millis() - pinchStartTime;
      circleSize = minCircleSize + (pinchDuration * growthRate);
      
      // Begrenze maximale Größe
      if (circleSize > maxCircleSize) {
        circleSize = maxCircleSize;
      }
    }
    pinchDetected = true;
  } else {
    // Kein Pinch mehr - Reset
    pinchDetected = false;
    circleSize = minCircleSize;
  }
}

/**
 * Zeichnet einen wachsenden blauen Kreis in der Bildschirmmitte
 * Größe hängt von der Dauer der Pinch-Geste ab
 */
function drawBigCircle() {
  // Zurück zur normalen (nicht gespiegelten) Koordinaten
  pop();
  push();
  
  // Berechne Transparenz basierend auf Kreisgröße (größer = transparenter)
  let transparency = map(circleSize, minCircleSize, maxCircleSize, 150, 80);
  
  // Kreis-Eigenschaften
  fill(100, 150, 255, transparency); // Transparenz ändert sich mit Größe
  stroke(0, 100, 255);               // Blaue Kontur
  strokeWeight(5);
  
  // Wachsender Kreis in der Bildschirmmitte
  let centerX = width / 2;
  let centerY = height / 2;
  
  circle(centerX, centerY, circleSize);
  
  // Zeige Größen-Info als Text
  fill(255);
  textAlign(CENTER);
  textSize(16);
  text("Kreisgröße: " + int(circleSize), centerX, centerY + circleSize/2 + 30);
  
  // Zurück zur gespiegelten Ansicht
  pop();
  push();
  translate(width, 0);
  scale(-1, 1);
}

