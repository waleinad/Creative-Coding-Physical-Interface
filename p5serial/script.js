let serial;                             // variable to hold an instance of the serialport library
// let portName = '/dev/cu.usbmodem1412301';  // fill in your serial port name here
let inData;                             // for incoming serial data
let portSelector;

let cx, cy;
let secsRadius;
let minsRadius;
let hrsRadius;
let clockDiameter;


function setup() {
  createCanvas(700, 700);
  serial = new p5.SerialPort();       // make a new instance of the serialport library
  serial.on('list', printList);       // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen);        // callback for the port opening
  serial.on('data', serialEvent);     // callback for when new data arrives
  serial.on('error', serialError);    // callback for errors
  serial.on('close', portClose);      // callback for the port closing

  serial.list();                      // list the serial ports
  // serial.openPort(portName);              // open a serial port

  stroke(255);

}

function draw() {
  // black background, white text:
  // background(50, 50);
  fill(255);
  // display the incoming serial data as a string:
  text("sensor value: " + inData, 30, 50);

  // fill(inData, 128, 128);
  // ellipse(300, 300, inData * 2);

  background(230);
  //clock(width / 2, height / 2, min(width, height) / 2);
  clock(300, 300, 150);
  clock(100, 100, 50, 50);
  clock(400, 100, 70, 99);
  clock(500, 600, 100, 60);
  clock(100, 500, 120, 90);
  clock(600, 250, 120);
  clock(500, 450, 50);
  clock(50, 300, 70);
  clock(300, 600, 85);
  clock(220, 50, 110);
  clock(650, 520, 80);
  clock(650, 100, 70, 90);
  clock(520, 20, 65);  

}

function clock(cx, cy, radius, cAlpha){
  secsRadius = radius * 0.71;
  minsRadius = radius * 0.6;
  hrsRadius = radius * 0.5;
  clockDiameter = radius * 1.7;

  // clock background
  noStroke();
  fill(244, 247, 247, cAlpha);
  ellipse(cx, cy, clockDiameter * 1.1, clockDiameter * 1.1);
  fill(60, 87, 88, cAlpha);
  ellipse(cx, cy, clockDiameter, clockDiameter);

  // Angles for sin() and cos() start at 3 o'clock;
  // subtract HALF_PI to make them start at the top
  let s = map(inData, 0, 480, 0, TWO_PI) - HALF_PI;
  let m = map(minute() + norm(second(), 0, 60), 0, 60, 0, TWO_PI) - HALF_PI;
  let h = map(hour() + norm(minute(), 0, 60), 0, 24, 0, TWO_PI * 2) - HALF_PI;

  // clock tick area
  push();
  stroke(255);
  strokeWeight(0);
  fill(255, 80);
  arc(cx, cy, 2 * secsRadius, 2 * secsRadius, -HALF_PI, s);
  arc(cx, cy, 2 * minsRadius, 2 * minsRadius, -HALF_PI, m);
  arc(cx, cy, 2 * hrsRadius, 2 * hrsRadius, -HALF_PI, h);
  pop();  
  
  // clock hands
  stroke(255);
  strokeWeight(radius * 0.02);
  line(cx, cy, cx + cos(s) * secsRadius, cy + sin(s) * secsRadius);
  strokeWeight(radius * 0.03);
  line(cx, cy, cx + cos(m) * minsRadius, cy + sin(m) * minsRadius);
  strokeWeight(radius * 0.05);
  line(cx, cy, cx + cos(h) * hrsRadius, cy + sin(h) * hrsRadius); 

  // minute ticks
  push();
  strokeWeight(radius * 0.07);
  beginShape(POINTS);
  for (let p = 0; p < 360; p += 90) {
    let angle = radians(p);
    let x = cx + cos(angle) * secsRadius;
    let y = cy + sin(angle) * secsRadius;
    vertex(x, y);
  }
  endShape();
  pop(); 
  
  // tick animation
  if (s == HALF_PI) {
    strokeWeight(radius * 0.16);
    beginShape(POINTS);
    let angle = radians(90);
    let x = cx + cos(angle) * secsRadius;
    let y = cy + sin(angle) * secsRadius;
    vertex(x, y);
    endShape();
  } else if (s == PI) {
    strokeWeight(radius * 0.16);
    beginShape(POINTS);
    let angle = radians(180);
    let x = cx + cos(angle) * secsRadius;
    let y = cy + sin(angle) * secsRadius;
    vertex(x, y);
    endShape();
  } else if (s == QUARTER_PI) {
    strokeWeight(radius * 0.16);
    beginShape(POINTS);
    let angle = radians(270);
    let x = cx + cos(angle) * secsRadius;
    let y = cy + sin(angle) * secsRadius;
    vertex(x, y);
    endShape();    
  } else if (s == TWO_PI) {
    strokeWeight(radius * 0.16);
    beginShape(POINTS);
    let angle = radians(0);
    let x = cx + cos(angle) * secsRadius;
    let y = cy + sin(angle) * secsRadius;
    vertex(x, y);
    endShape();
  } else {
    strokeWeight(radius * 0.07);
  }

}

// make a serial port selector object:
function printList(portList) {
  // create a select object:
  portSelector = createSelect();
  portSelector.position(10, 10);
  // portList is an array of serial port names
  for (var i = 0; i < portList.length; i++) {
    // add this port name to the select object:
    portSelector.option(portList[i]);
  }
  // set an event listener for when the port is changed:
  portSelector.changed(mySelectEvent);
}

function mySelectEvent() {
  let item = portSelector.value();
  // if there's a port open, close it:
  if (serial.serialport != null) {
    serial.close();
  }
  // open the new port:
  serial.openPort(item);
}

function serverConnected() {
  console.log('connected to server.');
}

function portOpen() {
  console.log('the serial port opened.')
}

function serialEvent() {
  // read a byte from the serial port, convert it to a number:
  inString = serial.readLine();
  inData = inString
}

function serialError(err) {
  console.log('Something went wrong with the serial port. ' + err);
}

function portClose() {
  console.log('The serial port closed.');
}