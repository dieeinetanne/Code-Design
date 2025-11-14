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
let faceMesh;           // Das ml5.js FaceMesh-Modell
let video;              // Die Webcam
let hands = [];         // Array mit allen erkannten Händen
let faces = [];         // Array mit allen erkannten Gesichtern
let ratio;              // Skalierungsfaktor zwischen Video und Canvas
let isModelReady = false; // Flag, ob das Modell geladen und Hände erkannt wurden
let isFaceModelReady = false; // Flag, ob das Gesichtsmodell geladen ist

// Hut-Steuerung Variablen
let hatOffsetX = 0;     // X-Verschiebung des Huts
let hatOffsetY = 0;     // Y-Verschiebung des Huts

/**
 * Lädt das HandPose-Modell vor dem Setup
 * Diese Funktion wird automatisch vor setup() ausgeführt
 */
function preload() {
  handpose = ml5.handPose();
  faceMesh = ml5.faceMesh();
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
  
  // Starte Gesichts-Erkennung
  faceMesh.detectStart(video, gotFaces);
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
  image(video, 0, 0, video.width * ratio, video.height * ratio);
  
  // Zeichne nur, wenn das Modell bereit ist und Hände erkannt wurden
  if (isModelReady) {
    drawHandPoints();
  }
  
  // Zeichne Gesichter wenn verfügbar
  if (isFaceModelReady) {
    drawFacePoints();
  }
  
  // Hand-Glitzer-Effekt
  if (isModelReady) {
    // HIER KÖNNEN EIGENE/Andere ZEICHNUNGEN Oder Interaktionen HINZUGEFÜGT WERDEN
    // Beispiel: Zugriff auf Zeigefingerspitzen
if (hands.length >= 2) {
  // Erste Hand (Hand 0) - Zeigefingerspitze
  let hand1IndexTip = hands[0].keypoints[8];
  let x1 = hand1IndexTip.x * ratio;
  let y1 = hand1IndexTip.y * ratio;
  
  // Zweite Hand (Hand 1) - Zeigefingerspitze  
  let hand2IndexTip = hands[1].keypoints[8];
  let x2 = hand2IndexTip.x * ratio;
  let y2 = hand2IndexTip.y * ratio;
  
  // Jetzt können Sie mit den Positionen arbeiten
  // Beispiel: Zeichne eine Linie zwischen den Zeigefingerspitzen

  // Berechne den Mittelpunkt zwischen beiden Zeigefingerspitzen
  let midpointX = (x1 + x2) / 2;
  let midpointY = (y1 + y2) / 2;
  
  // Generiere magische Sterne basierend auf der Distanz
  let distance = dist(x1, y1, x2, y2);
  let numStars = map(distance, 0, width, 50, 5); // Je näher, desto mehr Sterne
  
  // Zeichne kleine gelbe Sterne
  for (let i = 0; i < numStars; i++) {
    let angle = random(TWO_PI);
    let radius = random(distance / 2);
    let starX = midpointX + cos(angle) * radius;
    let starY = midpointY + sin(angle) * radius;
    
    fill(255, 255, 0, random(150, 255)); // Gelbe Sterne mit variabler Transparenz
    noStroke();
    let starSize = random(3, 8);
    drawStar(starX, starY, starSize);
  }
}
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
 * Callback-Funktion für FaceMesh-Ergebnisse
 * Wird automatisch aufgerufen, wenn neue Gesichts-Daten verfügbar sind
 * 
 * @param {Array} results - Array mit erkannten Gesichtern
 */
function gotFaces(results) {
  faces = results;
  
  // Setze Flag, sobald erstes Gesicht erkannt wurde
  if (faces.length > 0) {
    isFaceModelReady = true;
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
      
    }
  }
}

/**
 * Zeichnet alle erkannten Gesichts-Keypoints
 * FaceMesh hat 468 Keypoints für detaillierte Gesichtserkennung
 */
function drawFacePoints() {
  // Durchlaufe alle erkannten Gesichter (normalerweise 1)
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];
    
    // Zeichne wichtige Gesichtspunkte (reduziert für bessere Performance)
    // Nasenspitze (Punkt 1), Stirnmitte (Punkt 10), Kinn (Punkt 175)
    let importantPoints = [1, 10, 175, 152, 234, 454]; // Nase, Stirn, Kinn, Augenbrauen
    
    for (let j = 0; j < importantPoints.length; j++) {
      let pointIndex = importantPoints[j];
      if (face.keypoints[pointIndex]) {
        let keypoint = face.keypoints[pointIndex];

      }
    }
    
    // Zeichne Zauberhut auf dem Kopf
    drawWizardHat(face);
  }
}

/**
 * Zeichnet einen Zauberhut auf dem erkannten Kopf
 * @param {Object} face - Das erkannte Gesicht mit Keypoints
 */
function drawWizardHat(face) {
  if (!face.keypoints[10]) return; // Prüfe ob Stirnpunkt verfügbar ist
  
  // Verwende Stirnmitte (Punkt 10) als Basis für den Hut
  let foreheadX = face.keypoints[10].x * ratio;
  let foreheadY = face.keypoints[10].y * ratio;
  
  // Berechne Hutgröße basierend auf Gesichtsgröße
  let faceWidth = face.box ? face.box.width * ratio : 150;
  let hatWidth = faceWidth * 1.2; // Vergrößert von 0.8 auf 1.2
  let hatHeight = hatWidth * 1.5;  // Vergrößert von 1.2 auf 1.5
  
  // Hutposition (oberhalb der Stirn)
  let hatBaseY = foreheadY - 20;
  let hatTopY = hatBaseY - hatHeight;
  
  // Zeichne den Hut
  // 1. Hut-Basis (Krempe)
  fill(50, 0, 100); // Dunkles Lila
  stroke(0);
  strokeWeight(2);
  ellipse(foreheadX, hatBaseY, hatWidth * 1.2, 20);
  
  // 2. Hut-Kegel
  fill(80, 20, 150); // Helles Lila
  triangle(
    foreheadX - hatWidth/3, hatBaseY - 10,  // Links unten
    foreheadX + hatWidth/3, hatBaseY - 10,  // Rechts unten
    foreheadX, hatTopY                       // Spitze oben
  );
  
  // 3. Hut-Verzierung (Sterne)
  drawStars(foreheadX, hatBaseY - hatHeight/2, hatWidth/4);
  
  // 4. Hutspitze mit kleinem Stern
  fill(255, 255, 0); // Gelber Stern
  noStroke();
  drawStar(foreheadX, hatTopY - 15, 8);
}

/**
 * Zeichnet magische Sterne auf den Hut
 * @param {number} centerX - X-Position des Zentrums
 * @param {number} centerY - Y-Position des Zentrums  
 * @param {number} area - Bereich für die Sterne
 */
function drawStars(centerX, centerY, area) {
  fill(255, 255, 0, 200); // Semi-transparente gelbe Sterne
  noStroke();
  
  // Zeichne 3-5 kleine Sterne auf dem Hut
  for (let i = 0; i < 4; i++) {
    let starX = centerX + random(-area, area);
    let starY = centerY + random(-area/2, area/2);
    drawStar(starX, starY, random(3, 6));
  }
}

/**
 * Zeichnet einen 5-zackigen Stern
 * @param {number} x - X-Position
 * @param {number} y - Y-Position
 * @param {number} size - Größe des Sterns
 */
function drawStar(x, y, size) {
  push();
  translate(x, y);
  beginShape();
  for (let i = 0; i < 10; i++) {
    let angle = map(i, 0, 10, 0, TWO_PI);
    let radius = i % 2 === 0 ? size : size/2;
    let starX = cos(angle) * radius;
    let starY = sin(angle) * radius;
    vertex(starX, starY);
  }
  endShape(CLOSE);
  pop();
}

