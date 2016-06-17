/*
 * Working Title: Tentaculor
 */

var colony; // A colony object

function setup() {
  colorMode(HSB, 360, 255, 255, 255);
  createCanvas(windowWidth, windowHeight);
  smooth();
  ellipseMode(RADIUS);
  p = new Parameters();
  gui = new dat.GUI();
  gui.remember(p);
  initGUI();
  background(p.bkgColor);
  if (p.debug) {frameRate(10);}
  colony = new Colony(p.colonySize, p.cellStartSize);
}

function draw() {
  if (!p.trails || p.debug) {background(p.bkgColor);}
  if (p.veils) {veil();} // Draws a near-transparent 'veil' in background colour over the frame
  if (!p.paused) {colony.run();}
  if (p.paused && mouseIsPressed) {colony.run();}
  if (p.paused && keyIsPressed) {colony.run();}
  if (colony.cells.length === 0) { if (keyIsPressed || p.autoRestart) {populateColony(); } }
}

function populateColony() {
  background(p.bkgColor); // Refresh the background
  colony.cells = [];
  if (p.randomize) {randomizer();}
  colony = new Colony(p.colonySize, p.cellStartSize); //Could Colony receive a color-seed value (that is iterated through in a for- loop?) (or randomized?)
}

function veil() {
  var transparency = 1; // 255 is fully opaque, 1 is virtually invisible
  blendMode(DIFFERENCE);
  noStroke();
  //fill(hue(p.bkgColor), saturation(p.bkgColor), brightness(p.bkgColor), transparency);
  fill(1);
  rect(-1, -1, width + 1, height + 1);
  blendMode(BLEND);
  fill(255);
}

function mousePressed() {
  var mousePos = createVector(mouseX, mouseY);
  var vel = p5.Vector.random2D();
  if (mousePos.x < (width-260)) {colony.spawn(mousePos, vel, p.fillColor, p.strokeColor, p.cellStartSize);}
}

function mouseDragged() {
  var mousePos = createVector(mouseX, mouseY);
  var vel = p5.Vector.random2D();
  if (mousePos.x < (width-260)) {colony.spawn(mousePos, vel, p.fillColor, p.strokeColor, p.cellStartSize);}
}

function screenDump() {
  saveCanvas('myCanvas', 'screendump.png', 'png');
}

function keyTyped() {

  if (key === '1') { // spawn RED
    if (p.centerSpawn) {var pos = createVector(width/2, height/2);} else {var pos = createVector(random(width), random(height));}
    var vel = p5.Vector.random2D();
    p.fillColHSV = { h: 0, s: 1, v: 1 };
    p.fillColor = color(p.fillColHSV.h, p.fillColHSV.s*255, p.fillColHSV.v*255); // Cell colour
    //var FillColor = color(0, 255, 255); //RED
    p.strokeColHSV = { h: 0, s: 1, v: 1 };
    p.strokeColor = color(p.strokeColHSV.h, p.strokeColHSV.s*255, p.strokeColHSV.v*255); // Cell colour
    //var StrokeColor = color(0, 0, 255);
    colony.spawn(pos, vel, p.fillColor, p.strokeColor, p.cellStartSize);
  }

  if (key === '2') { // spawn YELLOW
    if (p.centerSpawn) {var pos = createVector(width/2, height/2);} else {var pos = createVector(random(width), random(height));}
    var vel = p5.Vector.random2D();
    var FillColor = color(60, 255, 255); //RED
    var StrokeColor = color(0, 0, 255);
    colony.spawn(pos, vel, FillColor, StrokeColor, p.cellStartSize);
  }

  if (key === '3') { // spawn GREEN
    if (p.centerSpawn) {var pos = createVector(width/2, height/2);} else {var pos = createVector(random(width), random(height));}
    var vel = p5.Vector.random2D();
    var FillColor = color(120, 255, 255); //GREEN
    var StrokeColor = color(0, 0, 255);
    colony.spawn(pos, vel, FillColor, StrokeColor, p.cellStartSize);
  }

  if (key === '4') { // spawn CYAN
    if (p.centerSpawn) {var pos = createVector(width/2, height/2);} else {var pos = createVector(random(width), random(height));}
    var vel = p5.Vector.random2D();
    var FillColor = color(180, 255, 255); //GREEN
    var StrokeColor = color(0, 0, 255);
    colony.spawn(pos, vel, FillColor, StrokeColor, p.cellStartSize);
  }

  if (key === '5') { //spawn BLUE
    if (p.centerSpawn) {var pos = createVector(width/2, height/2);} else {var pos = createVector(random(width), random(height));}
    var vel = p5.Vector.random2D();
    var FillColor = color(240, 255, 255); //BLUE
    var StrokeColor = color(0, 0, 255);
    colony.spawn(pos, vel, FillColor, StrokeColor, p.cellStartSize);
  }

  if (key === '6') { //spawn VIOLET
    if (p.centerSpawn) {var pos = createVector(width/2, height/2);} else {var pos = createVector(random(width), random(height));}
    var vel = p5.Vector.random2D();
    var FillColor = color(300, 255, 255); //BLUE
    var StrokeColor = color(0, 0, 255);
    colony.spawn(pos, vel, FillColor, StrokeColor, p.cellStartSize);
  }

  if (key === ' ') { //spacebar respawns with current settings
    colony.cells = [];
  }

  if (key === 'p') { // P toggles 'paused' mode
    p.paused = !p.paused;
  }

  if (key === 'c') { // C toggles 'centered' mode
    p.centerSpawn = !p.centerSpawn;
  }

  if (key === 'd') { // D toggles 'cell debug' mode
    p.debug = !p.debug;
  }

  if (key === 'n') { // N toggles 'show nucleus' mode
    p.nucleus = !p.nucleus;
  }

  if (key === 's') { // S saves a screenshot
    screenDump();
  }

  if (key === 'r') { // R for Randomize
    randomizer();
    colony.cells = [];
  }

}

var initGUI = function () {

	var f1 = gui.addFolder('Colony');
		var controller = f1.add(p, 'colonySize', 1, 200).step(1).name('Nr. of cells').listen();
		  controller.onChange(function(value) {populateColony(); });
		var controller = f1.add(p, 'variance', 0, 100).step(1).name('Diversity').listen();
      controller.onChange(function(value) {populateColony(); });
		var controller = f1.add(p, 'centerSpawn').name('Centered').listen();
		  controller.onChange(function(value) {populateColony(); });
		f1.add(p, 'growing').name('Cells grow');

	var f2 = gui.addFolder('Colour');
	  var controller = f2.addColor(p, 'bkgColHSV').name('Background').listen();
	    controller.onChange(function(value) {p.bkgColor = color(value.h, value.s*255, value.v*255); background(p.bkgColor);});
	  var controller = f2.addColor(p, 'fillColHSV').name('Fill').listen();
      controller.onChange(function(value) {p.fillColor = color(value.h, value.s*255, value.v*255); populateColony();});
	  var controller = f2.addColor(p, 'strokeColHSV').name('Line').listen();
	    controller.onChange(function(value) {p.strokeColor = color(value.h, value.s*255, value.v*255); populateColony();});
	  var controller = f2.add(p, 'fillAlpha', 0, 255).name('Transp.(fill)').listen();
      controller.onChange(function(value) {populateColony();});
	  var controller = f2.add(p, 'strokeAlpha', 0, 255).name('Transp.(line)').listen();
	    controller.onChange(function(value) {populateColony();});

	var f3 = gui.addFolder("Fill Color tweaks");
	  f3.add(p, 'fill_HTwist').name('Fill Hue').listen();
    f3.add(p, 'fill_STwist').name('Fill Satur.').listen();
    f3.add(p, 'fill_BTwist').name('Fill Bright.').listen();
    f3.add(p, 'fill_ATwist').name('Fill Transp.').listen();

  var f4 = gui.addFolder("Line Color tweaks");
  	  f4.add(p, 'stroke_HTwist').name('Line Hue').listen();
      f4.add(p, 'stroke_STwist').name('Line Satur.').listen();
      f4.add(p, 'stroke_BTwist').name('Line Bright.').listen();
      f4.add(p, 'stroke_ATwist').name('Line Transp.').listen();

	var f5 = gui.addFolder("Growth");
		var controller = f5.add(p, 'cellStartSize', 10, 200).step(1).name('Size (start)').listen();
		  controller.onChange(function(value) {populateColony();});
		var controller = f5.add(p, 'cellEndSize', 0.5, 50).step(0.5).name('Size (end)').listen();
		  controller.onChange(function(value) {populateColony(); });
		var controller = f5.add(p, 'lifespan', 100, 5000).step(10).name('Lifespan').listen();
		  controller.onChange(function(value) {populateColony(); });
		var controller = f5.add(p, 'fertileStart', 0, 100).step(1).name('Fertility%').listen();
		  controller.onChange(function(value) {populateColony();});
		f5.add(p, 'spawnLimit').step(1).name('# Spawns');

	var f6 = gui.addFolder("Movement");
    f6.add(p, 'noisePercent', 0, 100).step(1).name('Noise%').listen();
	  f6.add(p, 'spiral', 0, 3).name('Screw').listen();
	  var controller =f6.add(p, 'stepSize', 0, 100).name('Step (cell)').listen();
	   controller.onChange(function(value) {if (p.stepSize==0) {p.stepped=false} else {p.stepped=true};});
	  f6.add(p, 'stepSizeN', 0, 100).name('Step (nucleus)').listen();

	var f7 = gui.addFolder("Appearance");
    f7.add(p, 'flatness', 0, 100).name('Flatness').listen();
    f7.add(p, 'nucleus').name('Nucleus').listen();
    f7.add(p, 'veils').name('Trails (short)');
    f7.add(p, 'trails').name('Trails (long)');

  var f8 = gui.addFolder("Options");
    var controller = f8.add(p, 'wraparound').name('Wraparound');
      controller.onChange(function(value) {populateColony();});
    f8.add(p, 'paused').name('Pause').listen();
    f8.add(p, 'autoRestart').name('Auto-restart');
    f8.add(p, 'randomize').name('Randomizer');
  gui.close();
}

var Parameters = function () { //These are the initial values, not the randomised ones
  this.colonySize = int(random (3,50)); // Max number of cells in the colony
  //this.colonySize = 1; // Max number of cells in the colony
  this.centerSpawn = false; // true=initial spawn is width/2, height/2 false=random
  this.autoRestart = false; // If true, will not wait for keypress before starting anew
  this.paused = false; // If true, draw will not advance unless mouseIsPressed
  this.randomize = false; // If true, parameters will be randomized on restart

  this.bkgColHSV = { h: random(360), s: random(), v: random() };
  this.bkgColor = color(this.bkgColHSV.h, this.bkgColHSV.s*255, this.bkgColHSV.v*255); // Background colour
  this.fillColHSV = { h: random(360), s: random(), v: random() };
  this.fillColor = color(this.fillColHSV.h, this.fillColHSV.s*255, this.fillColHSV.v*255); // Cell colour
  this.fillAlpha = random(255);
  this.strokeColHSV = { h: random(360), s: random(), v: random() };
  this.strokeColor = color(this.strokeColHSV.h, this.strokeColHSV.s*255, this.strokeColHSV.v*255); // Cell colour
  this.strokeAlpha = random(255);

  this.variance = random(100); // Degree of influence from modulators & tweakers (from 0-1 or 0-100%)

  if (random(1) > 0.8) {this.fill_HTwist = true;} else {this.fill_HTwist = false;}
  if (random(1) > 0.7) {this.fill_STwist = true;} else {this.fill_STwist = false;}
  if (random(1) > 0.8) {this.fill_BTwist = true;} else {this.fill_BTwist = false;}
  if (random(1) > 0.9) {this.fill_ATwist = true;} else {this.fill_ATwist = false;}
  if (random(1) > 0.8) {this.stroke_HTwist = true;} else {this.stroke_HTwist = false;}
  if (random(1) > 0.7) {this.stroke_STwist = true;} else {this.stroke_STwist = false;}
  if (random(1) > 0.8) {this.stroke_BTwist = true;} else {this.stroke_BTwist = false;}
  if (random(1) > 0.9) {this.stroke_ATwist = true;} else {this.stroke_ATwist = false;}

  this.cellStartSize = random(30,100); // Cell radius at spawn
  this.cellEndSize = random(0, 10);
  this.lifespan = int(random (100, 5000)); // Max lifespan in #frames
  this.fertileStart = int(random(90));
  this.spawnLimit = int(random(10));
  this.flatness = random(0, 50); // Amount of flatness (from circle to ellipse)
  if (random(1) > 0.8) {this.nucleus = true;} else {this.nucleus = false;}

  this.noisePercent = random(100); // Percentage of velocity coming from noise-calculation
  this.spiral = random(2); // Number of full (TWO_PI) rotations the velocity heading will turn through during lifespan
  this.stepSize = 0;
  this.stepSizeN = 10;
  this.stepped = false;
  this.wraparound = true;

  this.growing = true;
  this.veils = false;
  this.trails = true;

  this.debug = false;
}

this.randomizer = function() {
  p.colonySize = int(random (2,30));
  if (random(1) > 0.4) {p.centerSpawn = true;} else {p.centerSpawn = false;}

  p.bkgColHSV = { h: random(360), s: random(), v: random() };
  p.bkgColor = color(p.bkgColHSV.h, p.bkgColHSV.s*255, p.bkgColHSV.v*255);
  p.fillColHSV = { h: random(360), s: random(), v: random() };
  p.fillColor = color(p.fillColHSV.h, p.fillColHSV.s*255, p.fillColHSV.v*255);
  p.strokeColHSV = { h: random(360), s: random(), v: random() };
  p.strokeColor = color(p.strokeColHSV.h, p.strokeColHSV.s*255, p.strokeColHSV.v*255);
  p.fillAlpha = random(255);
  p.strokeAlpha = random(255);

  p.variance = random(100);

  if (random(1) > 0.5) {p.fill_HTwist = true;} else {p.fill_HTwist = false;}
  if (random(1) > 0.5) {p.fill_STwist = true;} else {p.fill_STwist = false;}
  if (random(1) > 0.5) {p.fill_BTwist = true;} else {p.fill_BTwist = false;}
  if (random(1) > 0.5) {p.fill_ATwist = true;} else {p.fill_ATwist = false;}
  if (random(1) > 0.5) {p.stroke_HTwist = true;} else {p.stroke_HTwist = false;}
  if (random(1) > 0.5) {p.stroke_STwist = true;} else {p.stroke_STwist = false;}
  if (random(1) > 0.5) {p.stroke_BTwist = true;} else {p.stroke_BTwist = false;}
  if (random(1) > 0.5) {p.stroke_ATwist = true;} else {p.stroke_ATwist = false;}

  p.cellStartSize = random(25,50);
  p.cellEndSize = random(0, 20);
  p.lifespan = int(random (100, 3000));
  p.fertileStart = int(random(95));
  p.spawnLimit = int(random(10));
  p.flatness = random(100);
  if (random(1) > 0.7) {p.nucleus = true;} else {p.nucleus = false;}

  p.noisePercent = random(100); // Percentage of velocity coming from noise-calculation
  p.spiral = random(3); // Number of full (TWO_PI) rotations the velocity heading will turn through during lifespan
  if (random(1) < 0.7) {p.stepSize = 0;} else {p.stepSize = random(100)};
  if (p.stepSize==0) {p.stepped=false} else {p.stepped=true}
  p.stepSizeN = random(20);
}
