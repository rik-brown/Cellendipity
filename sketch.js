/*
 * Working Title: Tentaculor
 *
 *
 * RANDOMIZER on restart
 *
 */

var colony; // A colony object

function setup() {
  //frameRate(10); // Useful for debugging
  colorMode(HSB, 360, 100, 100, 100);
  createCanvas(windowWidth, windowHeight);
  smooth();
  ellipseMode(RADIUS);
  p = new Parameters();
  gui = new dat.GUI();
  gui.remember(p);
  initGUI();
  background(p.bkgColor);
  colony = new Colony(p.colonySize, p.cellStartSize);
}

function draw() {
  if (!p.trails || p.debugCell) {background(p.bkgColor);}
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
    var FillColor = color(0, 100, 100); //RED
    var StrokeColor = color(0, 0, 100);
    colony.spawn(pos, vel, FillColor, StrokeColor, p.cellStartSize);
  }
  
  if (key === '2') { // spawn YELLOW
    if (p.centerSpawn) {var pos = createVector(width/2, height/2);} else {var pos = createVector(random(width), random(height));}
    var vel = p5.Vector.random2D();
    var FillColor = color(60, 100, 100); //RED
    var StrokeColor = color(0, 0, 100);
    colony.spawn(pos, vel, FillColor, StrokeColor, p.cellStartSize);
  }

  if (key === '3') { // spawn GREEN
    if (p.centerSpawn) {var pos = createVector(width/2, height/2);} else {var pos = createVector(random(width), random(height));}
    var vel = p5.Vector.random2D();
    var FillColor = color(120, 100, 100); //GREEN
    var StrokeColor = color(0, 0, 100);
    colony.spawn(pos, vel, FillColor, StrokeColor, p.cellStartSize);
  }
  
  if (key === '4') { // spawn CYAN
    if (p.centerSpawn) {var pos = createVector(width/2, height/2);} else {var pos = createVector(random(width), random(height));}
    var vel = p5.Vector.random2D();
    var FillColor = color(180, 100, 100); //GREEN
    var StrokeColor = color(0, 0, 100);
    colony.spawn(pos, vel, FillColor, StrokeColor, p.cellStartSize);
  }
  
  if (key === '5') { //spawn BLUE
    if (p.centerSpawn) {var pos = createVector(width/2, height/2);} else {var pos = createVector(random(width), random(height));}
    var vel = p5.Vector.random2D();
    var FillColor = color(240, 100, 100); //BLUE
    var StrokeColor = color(0, 0, 100);
    colony.spawn(pos, vel, FillColor, StrokeColor, p.cellStartSize);
  }
  
  if (key === '6') { //spawn VIOLET
    if (p.centerSpawn) {var pos = createVector(width/2, height/2);} else {var pos = createVector(random(width), random(height));}
    var vel = p5.Vector.random2D();
    var FillColor = color(300, 100, 100); //BLUE
    var StrokeColor = color(0, 0, 100);
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
    p.debugCell = !p.debugCell;
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

	var f1 = gui.addFolder('Population');
		var controller = f1.add(p, 'colonySize', 1, 200).step(1).name('Size (start)').listen();
		controller.onChange(function(value) {populateColony(); });
		f1.add(p, 'variance', 0, 100).name('Variance').listen(); // Waiting for a purpose...
		var controller = f1.add(p, 'centerSpawn').name('Centered').listen();
		controller.onChange(function(value) {populateColony(); });
		f1.add(p, 'autoRestart').name('Auto-restart');
		f1.add(p, 'randomize').name('Randomizer');
		f1.add(p, 'paused').name('Pause').listen();
	 
	var f2 = gui.addFolder('Colour');
	  var controller = f2.addColor(p, 'bkgColHSV').name('Background').listen();
	    controller.onChange(function(value) {p.bkgColor = color(value.h, value.s*100, value.v*100); background(p.bkgColor);});
	  var controller = f2.addColor(p, 'fillColHSV').name('Fill').listen();
      controller.onChange(function(value) {p.fillColor = color(value.h, value.s*100, value.v*100); populateColony();});  
	  var controller = f2.addColor(p, 'strokeColHSV').name('Line').listen();
	    controller.onChange(function(value) {p.strokeColor = color(value.h, value.s*100, value.v*100); populateColony();});  
	  var controller = f2.add(p, 'fillAlpha', 0, 100).name('Transp.(fill)').listen();
      controller.onChange(function(value) {populateColony();});
	  var controller = f2.add(p, 'strokeAlpha', 0, 100).name('Transp.(line)').listen();
	    controller.onChange(function(value) {populateColony();});
	
	var f3 = gui.addFolder("Color Modulators");
	  f3.add(p, 'fill_HTwist').name('Fill Hue').listen();
    f3.add(p, 'fill_STwist').name('Fill Satur.').listen();
    f3.add(p, 'fill_BTwist').name('Fill Bright.').listen();
    f3.add(p, 'fill_ATwist').name('Fill Transp.').listen();
	  f3.add(p, 'stroke_HTwist').name('Line Hue').listen();
    f3.add(p, 'stroke_STwist').name('Line Satur.').listen();
    f3.add(p, 'stroke_BTwist').name('Line Bright.').listen();
    f3.add(p, 'stroke_ATwist').name('Line Transp.').listen(); 
	
	var f4 = gui.addFolder("Shape");
		var controller = f4.add(p, 'cellStartSize', 10, 200).step(1).name('Size (start)').listen();
		controller.onChange(function(value) {populateColony();});
		var controller = f4.add(p, 'cellEndSize', 0.5, 50).step(0.5).name('Size (end)').listen();
		controller.onChange(function(value) {populateColony(); });
		var controller = f4.add(p, 'lifespan', 100, 5000).step(10).name('Lifespan').listen();
		controller.onChange(function(value) {populateColony(); });
		var controller = f4.add(p, 'fertileStart', 0, 100).name('Fertility').listen();
		controller.onChange(function(value) {populateColony();});
		f4.add(p, 'spawnLimit').name('Spawn Limit');
		f4.add(p, 'flatness', 0, 100).name('Flatness').listen();
		f4.add(p, 'nucleus').name('Nucleus').listen();
	
	var f5 = gui.addFolder("Movement");
        f5.add(p, 'noisePercent', 0, 100).step(1).name('Noise%').listen();
	f5.add(p, 'spiral', 0, 3).name('Screw').listen();
	var controller =f5.add(p, 'stepSize', 0, 100).name('Step size').listen();
	    controller.onChange(function(value) {if (p.stepSize==0) {p.stepped=false} else {p.stepped=true};});
	f5.add(p, 'stepSizeN', 0, 100).name('Step size Nucleus').listen();
	var controller =f5.add(p, 'wraparound').name('Wraparound');
	    controller.onChange(function(value) {populateColony();});
	  
	var f6 = gui.addFolder("Options");
	  f6.add(p, 'growing').name('Growing');
	f6.add(p, 'coloring').name('Coloring');
    f6.add(p, 'veils').name('Trails (short)');
    f6.add(p, 'trails').name('Trails (long)');

  var f7 = gui.addFolder("Debug");
    f7.add(p, 'debugCell').name('Debug (cell)').listen();
    f7.add(p, 'debugColony').name('Debug (colony)');
}

var Parameters = function () { //These are the initial values, not the randomised ones
  this.colonySize = int(random (3,50)); // Max number of cells in the colony
  //this.colonySize = 1; // Max number of cells in the colony
  this.centerSpawn = false; // true=initial spawn is width/2, height/2 false=random
  this.autoRestart = false; // If true, will not wait for keypress before starting anew
  this.paused = false; // If true, draw will not advance unless mouseIsPressed
  this.randomize = false; // If true, parameters will be randomized on restart

  this.bkgColHSV = { h: random(360), s: random(), v: random() };
  this.bkgColor = color(this.bkgColHSV.h, this.bkgColHSV.s*100, this.bkgColHSV.v*100); // Background colour
  this.fillColHSV = { h: random(360), s: random(), v: random() };
  this.fillColor = color(this.fillColHSV.h, this.fillColHSV.s*100, this.fillColHSV.v*100); // Cell colour
  this.fillAlpha = random(100);
  this.strokeColHSV = { h: random(360), s: random(), v: random() };
  this.strokeColor = color(this.strokeColHSV.h, this.strokeColHSV.s*100, this.strokeColHSV.v*100); // Cell colour
  this.strokeAlpha = random(100);
  
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
  this.fertileStart = random(100);
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
  this.coloring = true;
  this.veils = false;
  this.trails = true;
  
  this.debugCell = false;
  this.debugColony = false;
}

this.randomizer = function() {
  p.colonySize = int(random (2,30));
  if (random(1) > 0.4) {p.centerSpawn = true;} else {p.centerSpawn = false;}
  
  p.bkgColHSV = { h: random(360), s: random(), v: random() };
  p.bkgColor = color(p.bkgColHSV.h, p.bkgColHSV.s*100, p.bkgColHSV.v*100);
  p.fillColHSV = { h: random(360), s: random(), v: random() };
  p.fillColor = color(p.fillColHSV.h, p.fillColHSV.s*100, p.fillColHSV.v*100);
  p.strokeColHSV = { h: random(360), s: random(), v: random() };
  p.strokeColor = color(p.strokeColHSV.h, p.strokeColHSV.s*100, p.strokeColHSV.v*100);
  p.fillAlpha = random(100);
  p.strokeAlpha = random(100);

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
  p.fertileStart = random(95);
  p.spawnLimit = int(random(10));
  p.flatness = random(100);
  if (random(1) > 0.7) {p.nucleus = true;} else {p.nucleus = false;}

  p.noisePercent = random(100); // Percentage of velocity coming from noise-calculation
  p.spiral = random(3); // Number of full (TWO_PI) rotations the velocity heading will turn through during lifespan
  if (random(1) < 0.7) {p.stepSize = 0;} else {p.stepSize = random(100)};
  if (p.stepSize==0) {p.stepped=false} else {p.stepped=true}
  p.stepSizeN = random(20);
}

/* ------------------------------------------------------------------------------------------------------------- */

// Colony class

// CONSTRUCTOR: Create a 'Colony' object, initially populated with 'num' cells
function Colony(num, cellStartSize_) { // Imports 'num' from Setup in main, the number of Cells in initial spawn 
  // Start with an array for all cells
  this.cells = [];

  // VARIABLES

  var colonyMaxSize = 500;
  var colRand = random(-PI, PI);
  
  // Create initial population of cells  
  for (var i = 0; i < num; i++) {
    if (p.centerSpawn) {var pos = createVector(width/2, height/2);} else {var pos = createVector(random(width), random(height));}
    var vel = p5.Vector.random2D(); // Initial velocity vector is random
    var dna = new DNA(); // Get new DNA
    this.cells.push(new Cell(pos, vel, p.fillColor, p.strokeColor, dna, p.cellStartSize)); // Add new Cell with DNA
  }

  this.spawn = function(mousePos, vel, fillColor_, strokeColor_, cellStartSize_) {
    // Spawn a new cell (called by e.g. MousePressed in main, accepting mouse coords for start position)
    //var vel = p5.Vector.random2D(); // for the time being, vel is random
    var dna = new DNA();
    var cellStartSize = cellStartSize_;
    var fillColor = fillColor_;
    var strokeColor = strokeColor_;
    this.cells.push(new Cell(mousePos, vel, fillColor, strokeColor, dna, cellStartSize));
  };

  // Run the colony
  this.run = function() {

    if (p.debugColony) {this.colonyDebugger(); }

    // Iterate backwards through the ArrayList because we are removing items
    for (var i = this.cells.length - 1; i >= 0; i--) {
      var c = this.cells[i]; // Get one cell at a time
      c.run(); // Run it (grow, move, check position vs boundaries etc.)

      // If cell has died, remove it from the array
      if (c.dead()) {
        this.cells.splice(i, 1);
      }

      // Iteration to check collision between current cell(i) and the rest
      if (this.cells.length <= colonyMaxSize) { // Don't check for collisons if there are too many cells (wait until some die off)
        for (var others = i - 1; others >= 0; others--) { // Since main iteration (i) goes backwards, this one needs to too
          var other = this.cells[others]; // Get the other cells, one by one
          if (c.age > 20 && other.age > 20) {
            c.checkCollision(other);
          } // Don't check for collisions between newly-spawned cells
        }
      }
    }

    // If there are too many cells, remove some by 'culling' (not actually active now, functional code is commented out)
    if (this.cells.length > colonyMaxSize) {
      this.cull(colonyMaxSize);
    }
  };

  this.cull = function(div) { // To remove a proportion of the cells from (the oldest part of) the colony
    var cull = (this.cells.length / div);
    for (var i = cull; i >= 0; i--) { this.cells.splice(i,1); }
    //background(0);                    // Use this to clear the background on cull
    //fill(255, 1);                     // Use this to veil the background on cull
    //rect(-1, -1, width+1, height+1);
  };

  this.colonyDebugger = function() { // For debug only
    fill(0);
    rect(0,0,300,20);
    fill(360, 100);
    textSize(16);
    text("Nr. cells: " + this.cells.length + " MaxLimit:" + colonyMaxSize + " Paused: " + p.paused, 10, 20);
  };
}

/* ------------------------------------------------------------------------------------------------------------- */

// cell Class
function Cell(pos, vel, fillColor_, strokeColor_, dna_, cellStartSize_) {

  //  Objects
  
  this.dna = dna_;

  // DNA gene mapping (14 genes)
  // 0 = cellStartSize
  // 1 = cellEndSize
  // 2 = lifespan
  // 3 = step (Noise) & noisePercent
  // 4 = vMax (Noise) & spiral screw
  // 5 = fill Hue
  // 6 = fill Saturation
  // 7 = fill Brightness
  // 8 = fill Alpha
  // 9 = stroke Hue
  // 10 = stroke Saturation
  // 11 = stroke Brightness
  // 12 = stroke Alpha
  // 13 = flatness & spiral handedness
  // 14 = Fertility

  // BOOLEAN
  this.fertile = false; // A new cell always starts of infertile

  // GROWTH & REPRODUCTION
  this.age = 0; // Age is 'number of frames since birth'. A new cell always starts with age = 0. What is it used for?
  this.lifespan = lerp(p.lifespan, (p.lifespan * map(this.dna.genes[2], 0, 1, 0.8, 1.2)), p.variance/100); // Lifespan can be lowered by DNA but not increased
  this.fertility = lerp(p.fertileStart/100, (p.fertileStart/100 * map(this.dna.genes[14], 0, 1, 0.7, 1.0)), p.variance/100); // Fertility can be lowered by DNA but not increased
  this.spawnCount = int(p.spawnLimit); // Max. number of spawns 
  
  // SIZE AND SHAPE
  this.cellStartSize = lerp(cellStartSize_, (cellStartSize_ * map(this.dna.genes[1], 0, 1, 0.8, 1.0)), p.variance/100); // Note: If last value in map() is >1 then new cells may be larger than their parents
  this.cellEndSize = lerp(p.cellEndSize, (p.cellEndSize * map(this.dna.genes[2], 0, 1, 1.0, 2.0)), p.variance/100);
  this.r = this.cellStartSize; // Initial value for radius
  this.size = map(this.r, this.cellStartSize, this.cellEndSize, 1, 0);
  this.flatness = lerp(p.flatness/100, (p.flatness/100 * map(this.dna.genes[13], 0, 1, 0.8, 1.2)), p.variance/100) +1; // To make circles into ellipses
  this.growth = (this.cellStartSize-this.cellEndSize)/p.lifespan; // Should work for both large>small and small>large
  this.drawStep = 1;
  this.drawStepN = 1;

  // MOVEMENT
  this.position = pos; //cell has position
  this.velocityLinear = vel; //cell has unique basic velocity component
  this.noisePercent = lerp(p.noisePercent, (p.noisePercent * map(this.dna.genes[3], 0, 1, 0.8, 1.2)), p.variance/100); // Spiral amount varies according to gene[4]
  this.spiral = lerp(p.spiral, (p.spiral * map(this.dna.genes[4], 0, 1, 0.8, 1.2)), p.variance/100); // Spiral amount varies according to gene[4]
  this.vMax = map(this.dna.genes[4], 0, 1, 0, 4); //Maximum magnitude in velocity components generated by noise
  this.xoff = random(1000); //Seed for noise
  this.yoff = random(1000); //Seed for noise
  this.step = map(this.dna.genes[3], 0, 1, 0.001, 0.006); //Step-size for noise

  // COLOUR

  // FILL COLOR
  this.fill_H = lerp(hue(fillColor_), (hue(fillColor_) * map(this.dna.genes[5], 0, 1, 0.95, 1.05)), p.variance/100);
  this.fill_S = lerp(saturation(fillColor_), (saturation(fillColor_) * map(this.dna.genes[6], 0, 1, 0.9, 1.1)), p.variance/100);
  this.fill_B = lerp(brightness(fillColor_), (brightness(fillColor_) * map(this.dna.genes[7], 0, 1, 0.9, 1.1)), p.variance/100);
  this.fillColor = color(this.fill_H, this.fill_S, this.fill_B); // Initial color is set
  this.fillAlpha = lerp(p.fillAlpha, (p.fillAlpha * map(this.dna.genes[8], 0, 1, 0.9, 1.1)), p.variance/100);
  
  //STROKE COLOR
  this.stroke_H = lerp(hue(strokeColor_), (hue(strokeColor_) * map(this.dna.genes[9], 0, 1, 0.95, 1.05)), p.variance/100);
  this.stroke_S = lerp(saturation(strokeColor_), (saturation(strokeColor_) * map(this.dna.genes[10], 0, 1, 0.9, 1.1)), p.variance/100);
  this.stroke_B = lerp(brightness(strokeColor_), (brightness(strokeColor_) * map(this.dna.genes[11], 0, 1, 0.9, 1.1)), p.variance/100);
  this.strokeColor = color(this.stroke_H, this.stroke_S, this.stroke_B); // Initial color is set
  this.strokeAlpha = lerp(p.strokeAlpha, (p.strokeAlpha * map(this.dna.genes[12], 0, 1, 0.9, 1.1)), p.variance/100);
 
  // Variables for LINEAR MOVEMENT WITH COLLISIONS
  this.m = this.r * 0.1; // Mass (sort of)

  this.run = function() {
    this.live();
    this.updatePosition();
    if (p.growing) {this.updateSize();}
    this.updateFertility();
    if (p.coloring) {this.updateColor();}
    if (p.wraparound) {this.checkBoundaryWraparound();}
    this.display();
    if (p.debugCell) {this.cellDebugger(); }
  }

  this.live = function() {
    this.age += 1;
    this.maturity = map(this.age, 0, this.lifespan, 1, 0);
    this.drawStep--;
    //this.drawStepStart = (this.r *2 + this.growth) * p.stepSize/100;
	this.drawStepStart = map(p.stepSize, 0, 100, 0 , (this.r *2 + this.growth));
    if (this.drawStep < 0) {this.drawStep = this.drawStepStart;}
    this.drawStepN--;
    this.drawStepNStart = map(p.stepSizeN, 0, 100, 0 , this.r *2);
    if (this.drawStepN < 0) {this.drawStepN = this.drawStepNStart;}
  }

  this.updatePosition = function() {
    var vx = map(noise(this.xoff), 0, 1, -this.vMax, this.vMax); // get new vx value from Perlin noise function
    var vy = map(noise(this.yoff), 0, 1, -this.vMax, this.vMax); // get new vy value from Perlin noise function
    var velocityNoise = createVector(vx, vy); // create new velocity vector based on new vx, vy components
    this.xoff += this.step; // increment x offset for next vx value
    this.yoff += this.step; // increment x offset for next vy value
    this.velocity = p5.Vector.lerp(this.velocityLinear, velocityNoise, p.noisePercent/100);
    var screwAngle = map(this.maturity, 0, 1, 0, this.spiral * TWO_PI); //swapped size with maturity
    if (this.dna.genes[4] >= 0.5) {screwAngle *= -1;}
    this.velocity.rotate(screwAngle);
    //this.velocity.mult(this.r + this.r + this.growth); //OLD CODE (alternative stepping), kept as a reminder
    this.position.add(this.velocity);
  }

  this.updateSize = function() { //Alternatively: cell is always growing, so include this in 'living' but allow for growth=0 ??
    this.r -= this.growth; // Cell can only shrink for now
    this.size = map(this.r, this.cellStartSize, this.cellEndSize, 1, 0);
  }

  this.updateFertility = function() {
    if (this.maturity <= this.fertility) {this.fertile = true; } else {this.fertile = false; } // A cell is fertile if maturity is within limit (a % of lifespan)
    if (this.spawnCount == 0) {this.fertility = 0;} // Once spawnCount has counted down to zero, the cell will spawn no more
  }

  this.updateColor = function() {
    /*
    * Pending improvements:
    * Amount of modulation is linked to a general "variance" slider
    * Is the toggle "coloring" actually necessary (since there are individual switches per twist-function)?
    * Hue is twisted by an angle (0-120 degrees) while S, B & A all transfom in the full range 0-100
    * Should not all color values be 'twisted' by a similar amount?
    * Maybe instead of an on/off switch, there is simply a slider for 'amount of tweak' (from 0 up to an amount)
    * Another thing: 
    * Hue is 'circular' - from 360 the next value is 0, there is continuity
    * How to make S & B 'circular' - maybe from 99 to 100, the next step should be 99 (like a sawtooth wave)
    */
    
    if (p.fill_STwist) {this.fill_S = map(this.size, 1, 0, 50, 100); this.fillColor = color(this.fill_H, this.fill_S, this.fill_B);} // Modulate fill saturation by radius
    if (p.fill_BTwist) {this.fill_B = map(this.size, 1, 0, 50, 100); this.fillColor = color(this.fill_H, this.fill_S, this.fill_B);} // Modulate fill brightness by radius
    if (p.fill_ATwist) {this.fillAlpha = map(this.size, 1, 0, 0, 100);} // Modulate fill Alpha by radius
    if (p.fill_HTwist) { // Modulate fill hue by radius. Does not change original hue value but replaces it with a 'twisted' version
      this.fill_Htwisted = map(this.size, 1, 0, this.fill_H, this.fill_H+60); 
      if (this.fill_Htwisted > 360) {this.fill_Htwisted -= 360;}
      this.fillColor = color(this.fill_Htwisted, this.fill_S, this.fill_B); //fill colour is updated with new hue value
    }
    if (p.stroke_STwist) {this.stroke_S = map(this.size, 1, 0, 50, 100); this.strokeColor = color(this.stroke_H, this.stroke_S, this.stroke_B);} // Modulate stroke saturation by radius
    if (p.stroke_BTwist) {this.stroke_B = map(this.size, 1, 0, 50, 100); this.strokeColor = color(this.stroke_H, this.stroke_S, this.stroke_B);} // Modulate stroke brightness by radius
    if (p.stroke_ATwist) {this.strokeAlpha = map(this.size, 1, 0, 0, 100);} // Modulate stroke Alpha by radius
    if (p.stroke_HTwist) { // Modulate stroke hue by radius
      this.stroke_Htwisted = map(this.size, 1, 0, this.stroke_H, this.stroke_H+60);
      if (this.stroke_Htwisted > 360) {this.stroke_Htwisted -= 360;}
      this.strokeColor = color(this.stroke_Htwisted, this.stroke_S, this.stroke_B); //stroke colour is updated with new hue value
    }
  }

  this.checkBoundaryRebound = function() { //This function is no longer called. If not missed, remove
    if (this.position.x > width - this.r) {
      this.position.x = width - this.r;
      this.velocity.x *= -1;
    } else if (this.position.x < this.r) {
      this.position.x = this.r;
      this.velocity.x *= -1;
    } else if (this.position.y > height - this.r) {
      this.position.y = height - this.r;
      this.velocity.y *= -1;
    } else if (this.position.y < this.r) {
      this.position.y = this.r;
      this.velocity.y *= -1;
    }
  }

  this.checkBoundaryWraparound = function() {
    if (this.position.x > width + this.r) {
      this.position.x = -this.r;
    } else if (this.position.x < -this.r) {
      this.position.x = width + this.r;
    } else if (this.position.y > height + this.r) {
      this.position.y = -this.r;
    } else if (this.position.y < -this.r) {
      this.position.y = height + this.r;
    }
  }

  // Death
  this.dead = function() {
    if (this.size <= 0) {return true;} // Size = 0 when r = cellEndSize
    if (this.age >= this.lifespan) {return true;} // Death by old age (regardless of size, which may remain constant)
    if (this.position.x > width + this.r || this.position.x < -this.r || this.position.y > height + this.r || this.position.y < -this.r) {return true;} // Death if move beyond canvas boundary
    else {return false; }
  };

  // Copied from the original Evolution EcoSystem sketch
  // NOT IN USE
  // Called from 'run' in colony to determine if a cell will spontaneously (& asexually) reproduce
  // Note: instead of void, the method returns a 'Cell' object
  this.reproduce = function() {
    if (random(1) < 0.003) {
      // Child DNA is exact copy of single parent
      var childDNA = this.dna.copy();
      // DNA can mutate if a random number is less than 0.01
      childDNA.geneMutate(0.01);
      return new Cell(this.position, this.velocity, this.fill_Colour, childDNA, this.cellStartSize); // this is a pretty cool trick!
    } else {
      return null; // If no child was spawned
    }
  };

  this.display = function() {

    stroke(hue(this.strokeColor), saturation(this.strokeColor), brightness(this.strokeColor), this.strokeAlpha);
    fill(hue(this.fillColor), saturation(this.fillColor), brightness(this.fillColor), this.fillAlpha);

    var angle = this.velocity.heading();
    push();
    translate(this.position.x, this.position.y);
    rotate(angle);
    if (!p.stepped) { // No step-counter for Cell
      ellipse(0, 0, this.r, this.r * this.flatness);
      if (p.nucleus && this.drawStepN < 1) {
        if (this.fertile) {
          fill(0); ellipse(0, 0, this.cellEndSize, this.cellEndSize * this.flatness);
        }
        else {
          fill(255); ellipse(0, 0, this.cellEndSize, this.cellEndSize * this.flatness);
        }
      }
    }
    else if (this.drawStep < 1) { // stepped=true, step-counter is active for cell, draw only when counter=0
      ellipse(0, 0, this.r, this.r*this.flatness);
      if (p.nucleus && this.drawStepN < 1) { // Nucleus is always drawn when cell is drawn (no step-counter for nucleus)
        if (this.fertile) {
          fill(0); ellipse(0, 0, this.cellEndSize, this.cellEndSize * this.flatness);
        }
        else {
          fill(255); ellipse(0, 0, this.cellEndSize, this.cellEndSize * this.flatness);
        }
      }
    }
    pop();
  };

  this.checkCollision = function(other) {
    // Method receives a Cell object 'other' to get the required info about the collidee
    if (this.fertile) {
      // Collision is not checked for infertile cells to prevent young spawn from colliding with their parents.
      // Consider moving this test upstream to where the method is called from

      var distVect = p5.Vector.sub(other.position, this.position); // Static vector to get distance between the cell & other

      // calculate magnitude of the vector separating the balls
      var distMag = distVect.mag();

      if (distMag < (this.r + other.r)) { // Test to see if a collision has occurred : is distance < sum of cell radius + other cell radius?

        if (this.fertile && other.fertile) {this.conception(other, distVect); }// Spawn a new cell if both colliding cells are fertile

        // get angle of distVect
        var theta = distVect.heading();
        // precalculate trig values
        var sine = sin(theta);
        var cosine = cos(theta);

        // posTemp will hold rotated cell positions. You just need to worry about posTemp[1] position
        var posTemp = [new p5.Vector(), new p5.Vector()];

        // this ball's position is relative to the other so you can use the vector between them (distVect) as the reference point in the rotation expressions.
        // posTemp[0].position.x and posTemp[0].position.y will initialize automatically to 0.0, which is what you want since b[1] will rotate around b[0]
        posTemp[1].x = cosine * distVect.x + sine * distVect.y;
        posTemp[1].y = cosine * distVect.y - sine * distVect.x;

        // rotate Temporary velocities
        var vTemp = [new p5.Vector(), new p5.Vector()];

        vTemp[0].x = cosine * this.velocity.x + sine * this.velocity.y;
        vTemp[0].y = cosine * this.velocity.y - sine * this.velocity.x;
        vTemp[1].x = cosine * other.velocity.x + sine * other.velocity.y;
        vTemp[1].y = cosine * other.velocity.y - sine * other.velocity.x;

        /* Now that velocities are rotated, you can use 1D conservation of momentum equations to calculate the final velocity along the x-axis. */
        var vFinal = [new p5.Vector(), new p5.Vector()];

        // final rotated velocity for b[0]
        vFinal[0].x = ((this.m - other.m) * vTemp[0].x + 2 * other.m * vTemp[1].x) / (this.m + other.m);
        vFinal[0].y = vTemp[0].y;

        // final rotated velocity for b[0]
        vFinal[1].x = ((other.m - this.m) * vTemp[1].x + 2 * this.m * vTemp[0].x) / (this.m + other.m);
        vFinal[1].y = vTemp[1].y;

        // hack to avoid clumping
        posTemp[0].x += vFinal[0].x;
        posTemp[1].x += vFinal[1].x;

        /* Rotate ball positions and velocities back. Reverse signs in trig expressions to rotate in the opposite direction */
        // rotate balls
        var bFinal = [new p5.Vector(), new p5.Vector()];

        bFinal[0].x = cosine * posTemp[0].x - sine * posTemp[0].y;
        bFinal[0].y = cosine * posTemp[0].y + sine * posTemp[0].x;
        bFinal[1].x = cosine * posTemp[1].x - sine * posTemp[1].y;
        bFinal[1].y = cosine * posTemp[1].y + sine * posTemp[1].x;

        // update balls to screen position
        other.position.x = this.position.x + bFinal[1].x;
        other.position.y = this.position.y + bFinal[1].y;

        this.position.add(bFinal[0]);

        // update velocities
        this.velocity.x = cosine * vFinal[0].x - sine * vFinal[0].y;
        this.velocity.y = cosine * vFinal[0].y + sine * vFinal[0].x;
        other.velocity.x = cosine * vFinal[1].x - sine * vFinal[1].y;
        other.velocity.y = cosine * vFinal[1].y + sine * vFinal[1].x;
      }
    }
  };

  

  this.conception = function(other, distVect) {
    // Decrease spawn counters.
    this.spawnCount--;
    other.spawnCount--;

    // Calculate position for spawn based on PVector between cell & other (leaving 'distVect' unchanged, as it is needed later)
    this.spawnPos = distVect.copy(); // Create spawnPos as a copy of the (already available) distVect which points from parent cell to other
    this.spawnPos.normalize();
    this.spawnPos.mult(this.r); // The spawn position is located at parent cell's radius
    this.spawnPos.add(this.position);

    // Calculate velocity vector for spawn as being centered between parent cell & other
    this.spawnVel = this.velocity.copy(); // Create spawnVel as a copy of parent cell's velocity vector 
    this.spawnVel.add(other.velocity); // Add dad's velocity
    this.spawnVel.normalize(); // Normalize to leave just the direction and magnitude of 1 (will be multiplied later)

    // Calculate new colour for child
    this.childFillColor = lerpColor(this.fillColor, other.fillColor, 0.5);
    
    // Calculate new stroke colour for child
    this.childStrokeColor = lerpColor(this.strokeColor, other.strokeColor, 0.5);
  
    // Call spawn method (in Colony) with the new parameters for position, velocity, colour & starting radius)
    colony.spawn(this.spawnPos, this.spawnVel, this.childFillColor, this.childStrokeColor, this.r);

    //Reset fertility counter
    this.fertility *= this.fertility;
    other.fertility *= other.fertility;
  }

  this.cellDebugger = function() {
    var rowHeight = 15;
    fill(255);
    textSize(rowHeight);
    //text("Your debug text HERE", this.position.x, this.position.y);
    // RADIUS
    //text("r:" + this.r, this.position.x, this.position.y + rowHeight*1);
    //text("cellStartSize:" + this.cellStartSize, this.position.x, this.position.y + rowHeight*2);
    //text("cellEndSize:" + this.cellEndSize, this.position.x, this.position.y + rowHeight*3);
    
    // COLOUR
    //text("fill_H:" + this.fill_H, this.position.x, this.position.y + rowHeight*4);
    //text("fill_Htw:" + this.fill_Htwisted, this.position.x, this.position.y + rowHeight*5);
    //text("fill_S:" + this.fill_S, this.position.x, this.position.y + rowHeight*6);
    //text("fill_B:" + this.fill_B, this.position.x, this.position.y + rowHeight*7);
    //text("this.fillCol:" + this.fillColor, this.position.x, this.position.y + rowHeight*2);
    //text("this.fillAlpha:" + this.fillAlpha, this.position.x, this.position.y + rowHeight*3);
    //text("this.fillCol (hue):" + hue(this.fillColor), this.position.x, this.position.y + rowHeight*2);
    //text("this.strokeCol:" + this.strokeColor, this.position.x, this.position.y + rowHeight*4);
    //text("this.strokeAlpha:" + this.strokeAlpha, this.position.x, this.position.y + rowHeight*5);
    
    // GROWTH
    //text("size:" + this.size, this.position.x, this.position.y + rowHeight*0);
    //text("growth:" + this.growth, this.position.x, this.position.y + rowHeight*5);
    text("maturity:" + this.maturity, this.position.x, this.position.y + rowHeight*1);
    text("lifespan:" + this.lifespan, this.position.x, this.position.y + rowHeight*0);
    //text("age:" + this.age, this.position.x, this.position.y + rowHeight*3);
    text("fertility:" + this.fertility, this.position.x, this.position.y + rowHeight*2);
    //text("fertile:" + this.fertile, this.position.x, this.position.y + rowHeight*3);
    //text("spawnCount:" + this.spawnCount, this.position.x, this.position.y + rowHeight*4);
    
    // MOVEMENT
    //text("vel.x:" + this.velocity.x, this.position.x, this.position.y + rowHeight*4);
    //text("vel.y:" + this.velocity.y, this.position.x, this.position.y + rowHeight*5);
    //text("vel.heading():" + this.velocity.heading(), this.position.x, this.position.y + rowHeight*3);
    //text("Noise%:" + p.noisePercent, this.position.x, this.position.y + rowHeight*1);
    //text("screw amount:" + p.spiral, this.position.x, this.position.y + rowHeight*2);
  }

}

/* ------------------------------------------------------------------------------------------------------------- */

// DNA class
// Copied from the original 'Nature of Code' example:
// Evolution EcoSystem
// Daniel Shiffman <http://www.shiffman.net>

// Class to describe DNA
// Has more features for two parent mating (not used in this example)

// Constructor (makes a random DNA)
function DNA(newgenes) {
  if (newgenes) {
    this.genes = newgenes;
  } else {
    // The genetic sequence
    // DNA is random floating point values between 0 and 1 (!!)
    this.genes = new Array(15);
    for (var i = 0; i < this.genes.length; i++) {
      this.genes[i] = random(0, 1);
    }
  }

  this.copy = function() {
    // should switch to fancy JS array copy
    var newgenes = [];
    for (var i = 0; i < this.genes.length; i++) {
      newgenes[i] = this.genes[i];
    }

    return new DNA(newgenes);
  };

  // Based on a mutation probability, picks a new random character in array spots
  this.mutate = function(m) {
    for (var i = 0; i < this.genes.length; i++) {
      if (random(1) < m) {
        this.genes[i] = random(0, 1);
      }
    }
  };
}
