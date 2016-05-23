/*
 * 2016.05.23 22:23
 * New branch: GUI_enhancements
 * Aiming to fix #9 Presets in the GUI (FIXED)
 * Aiming to fix #8 Randomiser
 * Have added 'randomisers' to most of the variables in the Parameters object
 * Now I just need an initialise function that can be called to give a new set of properties
 * Have made a test using the 'p' key but I don't think this is the right way to do it.
 * ALSO:
 * Would some GUI elements benefit from text-entry instead of a slider?
 * gui.add(text, 'maxSize').min(0).step(0.25); // Mix and match
 */

var colony; // A colony object

function setup() {
  //frameRate(10); // Useful for debugging
  colorMode(HSB, 360, 100, 100, 100);
  createCanvas(windowWidth, windowHeight - 4);
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
  if (!p.trails || p.debugCellText) {background(p.bkgColor);}
  if (p.veils) {veil();} // Draws a near-transparent 'veil' in background colour over the  frame
  colony.run();
  if (colony.cells.length === 0 && keyIsPressed) { // Repopulate the colony if it suffers an extinction (wait for keypress)
    //screenDump(); // Press 's' key to save
    background(p.bkgColor); // Refresh the background
    populateColony();
  }
}

function populateColony() {
  colony = new Colony(p.colonySize, p.cellStartSize); //Could Colony receive a color-seed value (that is iterated through in a for- loop?) (or randomized?)
 // colony = new Colony(10, cellStartSize); // Populate the colony with a single cell. Useful for debugging
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

// We can add a creature manually if we so desire
function mousePressed() {
  var mousePos = createVector(mouseX, mouseY);
  var vel = p5.Vector.random2D();
  if (mousePos.x < width) {
    if (p.debugMain) {print("xx " + String(mousePos));}
    if (p.debugMain) {print("yy " + String(p.fillColor));}
    if (p.debugMain) {print("zz " + String(p.strokeColor));}
    //println("fillColor: " + p.fillColor + "   fillAlpha: " + p.fillAlpha);
    //println("strokeColor: " + p.strokeColor + "   strokeAlpha: " + p.strokeAlpha);
    colony.spawn(mousePos, vel, p.fillColor, p.strokeColor, p.cellStartSize);
  }
}

function mouseDragged() {
  var mousePos = createVector(mouseX, mouseY);
  var vel = p5.Vector.random2D();
  if (mousePos.x < width) {
    if (p.debugMain) {print("xx " + String(mousePos));}
    if (p.debugMain) {print("yy " + String(p.fillColor));}
    if (p.debugMain) {print("zz " + String(p.strokeColor));}
    //println("fillColor: " + p.fillColor + "   fillAlpha: " + p.fillAlpha);
    //println("strokeColor: " + p.strokeColor + "   strokeAlpha: " + p.strokeAlpha);
    colony.spawn(mousePos, vel, p.fillColor, p.strokeColor, p.cellStartSize);
  }
}

function screenDump() {
  saveCanvas('myCanvas', 'screendump.png', 'png');
}

function keyTyped() {
  if (key === 'b') {
    var spawnPos = createVector(random(width), random(height));
    var FillColor = color(240, 100, 100); //BLUE
    var StrokeColor = color(0, 0, 100);
    if (p.debugMain) {print(String(FillColor));}
    colony.spawn(spawnPos, FillColor, StrokeColor, p.cellStartSize);
  }
  
  if (key === 'g') {
    var spawnPos = createVector(random(width), random(height));
    var FillColor = color(120, 100, 100); //GREEN
    var StrokeColor = color(0, 0, 100);
    if (p.debugMain) {print(String(FillColor));}
    colony.spawn(spawnPos, FillColor, StrokeColor, p.cellStartSize);
  }
  
  if (key === 'r') {
    var spawnPos = createVector(random(width), random(height));
    var FillColor = color(0, 100, 100); //RED
    var StrokeColor = color(0, 0, 100);
    if (p.debugMain) {print(String(FillColor));}
    colony.spawn(spawnPos, FillColor, StrokeColor, p.cellStartSize);
  }
  
  if (key === 'c') {
    colony.cullAll();
  }
  
  if (key === 'd') {
    p.debugCellText = !p.debugCellText;
  }
  
  if (key === 'n') {
    p.nucleus = !p.nucleus;
  }
  
  if (key === 's') {
    screenDump();
  }
  
  if (key === 'p') {
    p = new Parameters();
    colony.cullAll();
  }
}

var initGUI = function () {

// Add the GUI sections
	var f1 = gui.addFolder('Cells');
	f1.add(p, 'variance', 0, 1).step(0.01).name('Variance');
	var controller = f1.add(p, 'colonySize', 1, 200).step(1).name('Colony start size');
	controller.onChange(function(value) {
	  background(p.bkgColor);
	  colony.cullAll();
	  populateColony();
	});
	var controller = f1.add(p, 'cellStartSize', 10, 200).step(1).name('Cell start size');
	controller.onChange(function(value) {
	  background(p.bkgColor);
	  colony.cullAll();
	  populateColony();
	});
  var controller = f1.add(p, 'cellEndSize', 1, 50).step(1).name('Cell end size');
	controller.onChange(function(value) {
	  background(p.bkgColor);
	  colony.cullAll();
	  populateColony();
	});
	var controller = f1.add(p, 'lifespan', 100, 5000).step(10).name('Lifespan');
	controller.onChange(function(value) {
	  background(p.bkgColor);
	  colony.cullAll();
	  populateColony();
	});
	    
	var controller = f1.add(p, 'fertileStart', 0, 1).step(0.01).name('Fertile radius%');
	controller.onChange(function(value) {background(p.bkgColor);});
	    
	var f2 = gui.addFolder('Environment');
	var controller = f2.add(p, 'wraparound').name('Wraparound');
	controller.onChange(function(value) {background(p.bkgColor);});
	f2.add(p, 'trails').name('Trails');
	f2.add(p, 'veils').name('Veils');
	  
	var f3 = gui.addFolder('Background');
	var controller = f3.addColor(p, 'bkgColHSV').name('Background Colour');
	controller.onChange(function(value) { 
	  p.bkgColor = color(value.h, value.s*100, value.v*100);
	  background(p.bkgColor);
	});
	
	var f4 = gui.addFolder("Cell Fill");
  var controller = f4.addColor(p, 'fillColHSV').name('Cell Fill Colour');
  controller.onChange(function(value) {p.fillColor = color(value.h, value.s*100, value.v*100); });
  var controller = f4.add(p, 'fillAlpha', 0, 100).name('Cell Fill Alpha');
  controller.onChange(function(value) {populateColony();});
  f4.add(p, 'fill_HTwist').name('Hue twist');
  f4.add(p, 'fill_STwist').name('Saturation twist');
  f4.add(p, 'fill_BTwist').name('Brightness twist');
  f4.add(p, 'fill_ATwist').name('Alpha twist');

	var f5 = gui.addFolder("Cell Stroke");
	var controller = f5.addColor(p, 'strokeColHSV').name('Cell Stroke Colour');
	controller.onChange(function(value) {p.strokeColor = color(value.h, value.s*100, value.v*100); });
	var controller = f5.add(p, 'strokeAlpha', 0, 100).name('Cell Stroke Alpha');
	controller.onChange(function(value) {populateColony();});
  f5.add(p, 'stroke_HTwist').name('Hue twist');
  f5.add(p, 'stroke_STwist').name('Saturation twist');
  f5.add(p, 'stroke_BTwist').name('Brightness twist');
  f5.add(p, 'stroke_ATwist').name('Alpha twist'); 

	    
  var f6 = gui.addFolder("Options");
  f6.add(p, 'moving').name('Moving');
  f6.add(p, 'perlin').name('Perlin');
  f6.add(p, 'spawning').name('Spawning');
  f6.add(p, 'growing').name('Growing');
  f6.add(p, 'spiralling').name('Spiralling');
  f6.add(p, 'stepped').name('Stepped');
  f6.add(p, 'coloring').name('Coloring');
  f6.add(p, 'nucleus').name('Show nucleus');
    
  var f7 = gui.addFolder("Debug");
  f7.add(p, 'debugMain').name('Debug:Main');
  f7.add(p, 'debugCellText').name('Debug:Cell(txt)');
  f7.add(p, 'debugCellPrintln').name('Debug:Cell(print)');
  f7.add(p, 'debugColony').name('Debug:Colony');
}


var Parameters = function () {
  this.variance = random(1); // Degree of influence from modulators & tweakers (from 0-1 or 0-100%)
  this.colonySize = int(random (5,50)); // Max number of cells in the colony
  //this.colonySize = 1; // Max number of cells in the colony
  this.bkgColHSV = { h: random(360), s: random(), v: random() };
  this.bkgColor = color(this.bkgColHSV.h, this.bkgColHSV.s*100, this.bkgColHSV.v*100); // Background colour
  this.fillColHSV = { h: random(360), s: random(), v: random() };
  this.fillColor = color(this.fillColHSV.h, this.fillColHSV.s*100, this.fillColHSV.v*100); // Cell colour
  this.fillAlpha = random(100);
  this.strokeColHSV = { h: random(360), s: random(), v: random() };
  this.strokeColor = color(this.strokeColHSV.h, this.strokeColHSV.s*100, this.strokeColHSV.v*100); // Cell colour
  this.strokeAlpha = random(100);
  this.lifespan = int(random (100, 5000)); // Max lifespan in #frames
  this.cellStartSize = random(30,150); // Cell radius at spawn
  this.cellEndSize = random(0, 25);
  this.fertileStart = random(1);
  this.wraparound = true;
  this.trails = true;
  this.veils = false;
  this.moving = true;
  if (random(1) > 0.5) {this.perlin = true;} else {this.perlin = false;}
  this.spawning = true;
  this.growing = true;
  if (random(1) > 0.5) {this.spiralling = true;} else {this.spiralling = false;}
  if (random(1) > 0.7) {this.stepped = true;} else {this.stepped = false;}
  this.coloring = true;
  if (random(1) > 0.5) {this.fill_HTwist = true;} else {this.fill_HTwist = false;}
  if (random(1) > 0.5) {this.fill_STwist = true;} else {this.fill_STwist = false;}
  if (random(1) > 0.5) {this.fill_BTwist = true;} else {this.fill_BTwist = false;}
  if (random(1) > 0.5) {this.fill_ATwist = true;} else {this.fill_ATwist = false;}
  if (random(1) > 0.5) {this.stroke_HTwist = true;} else {this.stroke_HTwist = false;}
  if (random(1) > 0.5) {this.stroke_STwist = true;} else {this.stroke_STwist = false;}
  if (random(1) > 0.5) {this.stroke_BTwist = true;} else {this.stroke_BTwist = false;}
  if (random(1) > 0.5) {this.stroke_ATwist = true;} else {this.stroke_ATwist = false;}
  if (random(1) > 0.8) {this.nucleus = true;} else {this.nucleus = false;}
  this.debugMain = false; 
  this.debugCellText = false;
  this.debugCellPrintln = false;
  this.debugColony = false;
}



/* ------------------------------------------------------------------------------------------------------------- */

// Colony class

// CONSTRUCTOR: Create a 'Colony' object, initially populated with 'num' cells
function Colony(num, cellStartSize_) { // Imports 'num' from Setup in main, the number of Cells in initial spawn 
  // Start with an array for all cells
  this.cells = [];

  // VARIABLES

  var colonyMin = 10;
  var colonyMax = 500;
  var colRand = random(-PI, PI);
  
  // Create initial population of cells  
  for (var i = 0; i < num; i++) {
    var pos = createVector(random(width), random(height)); // Initial position vector is random
    //var pos = createVector(width/2, height/2);           // Initial position vector is center of canvas
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
    if (p.debugCellPrintln) {
      println("01 About to spawn with hue(fillColor)= " + hue(fillColor));
      print("02 String(fillColor)= " + String(fillColor));
    }
    this.cells.push(new Cell(mousePos, vel, fillColor, strokeColor, dna, cellStartSize));
  };


  // Run the colony
  this.run = function() {

    if (p.debugColony) {this.debugTextColony(); }

    // Iterate backwards through the ArrayList because we are removing items
    for (var i = this.cells.length - 1; i >= 0; i--) {
      var c = this.cells[i]; // Get one cell at a time
      c.run(); // Run it (grow, move, check position vs boundaries etc.)

      // If cell has died, remove it from the array
      if (c.dead()) {
        this.cells.splice(i, 1);
      }

      // Iteration to check collision between current cell(i) and the rest
      if (this.cells.length <= colonyMax) { // Don't check for collisons if there are too many cells (wait until some die off)
        for (var others = i - 1; others >= 0; others--) { // Since main iteration (i) goes backwards, this one needs to too
          var other = this.cells[others]; // Get the other cells, one by one
          if (c.age > 20 && other.age > 20) {
            c.checkCollision(other);
          } // Don't check for collisions between newly-spawned cells
        }
      }
    }

    // If there are too many cells, remove some by 'culling' (not actually active now, functional code is commented out)
    if (this.cells.length > colonyMax) {
      this.cull(colonyMax);
    }
  };

  this.cull = function(div) { // To remove a proportion of the cells from (the oldest part of) the colony
    var cull = (this.cells.length / div);
    for (var i = cull; i >= 0; i--) { this.cells.splice(i,1); }
    //background(0);                    // Use this to clear the background on cull
    //fill(255, 1);                     // Use this to veil the background on cull
    //rect(-1, -1, width+1, height+1);
  };

  this.cullAll = function() { // To remove ALL cells from the colony 
    for (var i = this.cells.length; i >= 0; i--) {
      this.cells.splice(i, 1);
    }
  };

  this.debugTextColony = function() { // For debug only
    fill(0);
    rect(0,0,300,20);
    fill(360, 100);
    textSize(16);
    text("Nr. cells: " + this.cells.length + " MinLimit:" + colonyMin + " MaxLimit:" + colonyMax, 10, 20);
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
  // 3 = step (Perlin)
  // 4 = vMax (Perlin)
  // 5 = fill Hue
  // 6 = fill Saturation
  // 7 = fill Brightness
  // 8 = fill Alpha
  // 9 = stroke Hue
  // 10 = stroke Saturation
  // 11 = stroke Brightness
  // 12 = stroke Alpha
  // 13 = Ellipse flatness & spiral handedness
  // 14 = Fertility

  // BOOLEAN
  this.fertile = false; // A new cell always starts of infertile
  this.drawSwitch = false;
  /* e.g
  * this.stepped
  */

  // GROWTH & REPRODUCTION
  this.age = 0; // Age is 'number of frames since birth'. A new cell always starts with age = 0. What is it used for?
  this.lifespan = p.lifespan * map(this.dna.genes[2], 0, 1, 0.8, 1.2); // Fertility can be lowered by DNA but not increased
  this.fertility = p.fertileStart * map(this.dna.genes[14], 0, 1, 0.7, 1.0); // Fertility can be lowered by DNA but not increased
  this.collCount = 3; // Number of collisions before DEATH
  
  // SIZE AND SHAPE
  this.cellStartSize = cellStartSize_ * map(this.dna.genes[1], 0, 1, 0.8, 1.0); // Note: If last value in map() is >1 then new cells may be larger than their parents
  this.cellEndSize = p.cellEndSize * map(this.dna.genes[2], 0, 1, 1.0, 2.0);
  this.r = this.cellStartSize; // Initial value for radius
  this.size = map(this.r, this.cellStartSize, this.cellEndSize, 1, 0);
  this.flatness = map(this.dna.genes[13], 0, 1, 1, 1.7); // To make circles into ellipses
  this.growth = (this.cellStartSize-this.cellEndSize)/p.lifespan; // Should work for both large>small and small>large
  this.drawStepStart = this.r * p.variance; //Starting value from which drawStep counts down. Could be size * constant?
  this.drawStep = this.drawStepStart;

  // COMMON
  this.position = pos; //cell has position
  this.velocity = vel; //cell has velocity

  // PERLIN
  this.vMax = map(this.dna.genes[4], 0, 1, 0, 4); //Maximum velocity when using movePerlin()
  this.xoff = random(1000); //Seed for noise
  this.yoff = random(1000); //Seed for noise
  this.step = map(this.dna.genes[3], 0, 1, 0.001, 0.006); //Step-size for noise

  // COLOUR

  // FILL COLOR
  this.fill_H = hue(fillColor_) * map(this.dna.genes[5], 0, 1, 0.95, 1.05) // 'Variance' can govern this range
  this.fill_S = saturation(fillColor_) * map(this.dna.genes[6], 0, 1, 0.9, 1.1)
  this.fill_B = brightness(fillColor_) * map(this.dna.genes[7], 0, 1, 0.9, 1.1)
  this.fillColor = color(this.fill_H, this.fill_S, this.fill_B); // Initial color is set
  this.fillAlpha = p.fillAlpha * map(this.dna.genes[8], 0, 1, 0.9, 1.1);
  if (p.debugCellPrintln) {
    println("03 (in cell) this.fillColor= " + this.fillColor);
    println("04 (in cell) hue(this.fillColor)= " + hue(this.fillColor));
  }
  
  //STROKE COLOR
  this.stroke_H = hue(strokeColor_) * map(this.dna.genes[9], 0, 1, 0.95, 1.05);
  this.stroke_S = saturation(strokeColor_) * map(this.dna.genes[10], 0, 1, 0.9, 1.1);
  this.stroke_B = brightness(strokeColor_) * map(this.dna.genes[11], 0, 1, 0.9, 1.1);
  this.strokeColor = color(this.stroke_H, this.stroke_S, this.stroke_B); // Initial color is set
  this.strokeAlpha = p.strokeAlpha * map(this.dna.genes[12], 0, 1, 0.9, 1.1);
 
  // COLOUR (other stuff)
  this.strokeOffset = random(-PI/2, PI/2); // Used in colorTwist to offset the stroke colour from the fill colour by this angle. VARIANCE??

  // Variables for LINEAR MOVEMENT WITH COLLISIONS
  this.m = this.r * 0.1; // Mass (sort of)

  this.run = function() {
    this.live();
    if (p.moving) {this.updatePosition();}
    if (p.growing) {this.updateSize();}
    if (p.spawning) {this.updateFertility();}
    if (p.coloring) {this.updateColor();}
    if (p.wraparound) {this.checkBoundaryWraparound();} else if (!p.perlin) {this.checkBoundaryRebound();}
    // if !wraparound && perlin : cells will be killed if they leave the screen (no bounce for perlin, no offscreen-kill for linear)
    this.display();
    if (p.debugCellText) {this.cellDebuggerText(); }
    if (p.debugCellPrintln) {this.cellDebuggerPrintln(); }
  }

  this.live = function() {
    this.age += 1;
    this.maturity = map(this.age, 0, this.lifespan, 1, 0);
    this.drawStep--;
    this.drawStepStart = this.r * p.variance ;
    if (this.drawStep < 0) {drawSwitch = true; this.drawStep = this.drawStepStart;}
  }

  this.updatePosition = function() {
    if (p.perlin) {this.movePerlin();}
      else {this.moveLinear();}
  }

  this.updateSize = function() { //Alternatively: cell is always growing, so include this in 'living' but allow for growth=0 ??
    this.r -= this.growth; // Cell can only shrink for now
    this.size = map(this.r, this.cellStartSize, this.cellEndSize, 1, 0);
  }

  this.updateFertility = function() {
    if (this.maturity <= this.fertility) {this.fertile = true; } else {this.fertile = false; } // A cell is fertile if maturity is within limit (a % of lifespan)
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
  
  this.moveLinear = function() {
    // Simple linear movement at constant (initial) velocity
    if (p.spiralling) {this.updateHeading();}
    this.position.add(this.velocity);
  };

  this.moveLinearStepped = function() {
    this.velocity.normalize(); // Convert to a unit-vector (magnitude = 1)
    this.velocity.mult(this.r + this.r + this.growth); // Set the magnitude to a size which will place the two consecutive circles adjacent to one another.
    this.position.add(this.velocity);
  };

  this.movePerlin = function() {
    // Simple movement based on perlin noise
    var vx = map(noise(this.xoff), 0, 1, -this.vMax, this.vMax);
    var vy = map(noise(this.yoff), 0, 1, -this.vMax, this.vMax);
    this.velocity = createVector(vx, vy);
    this.xoff += this.step;
    this.yoff += this.step;
    this.position.add(this.velocity);
  };

  this.movePerlinStepped = function() {
    // Experimental movement based on perlin noise
    var vx = map(noise(this.xoff), 0, 1, -this.vMax, this.vMax);
    var vy = map(noise(this.yoff), 0, 1, -this.vMax, this.vMax);
    this.velocity = createVector(vx, vy); // The changing angle is already given. It is only the magnitude which needs to be adressed!
    this.xoff += this.step;
    this.yoff += this.step;
    this.velocity.normalize(); // Convert to a unit-vector (magnitude = 1)
    velocity.mult(this.r + this.r + this.growth); // Set the magnitude to a size which will place the two consecutive circles adjacent to one another.
    this.position.add(this.velocity);
  };

  this.updateHeading = function() {
    // To create a spiral effect on when movement is linear (is not called when perlin=true)
    // Assumes that this.velocity is a unit vector (has only heading, no magnitude)
    var twist = this.velocity.copy();
    twist.normalize();
    var twistAngle = map(this.size, 0, 1, PI/180, 0);
    if (this.dna.genes[4] >= 0.5) {twistAngle *= -1;}
    twist.rotate(twistAngle);
    this.velocity.add(twist);
    this.velocity.normalize();
  }

  this.checkBoundaryRebound = function() {
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
    //if (this.collCount <= 0) {return true; } // not currently in use
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
    if (!p.stepped) {
      ellipse(0, 0, this.r, this.r * this.flatness);
      if (p.nucleus) {
        if (this.fertile) {
          fill(0); ellipse(0, 0, this.cellEndSize, this.cellEndSize * this.flatness);
        }
        else {
          fill(255); ellipse(0, 0, this.cellEndSize, this.cellEndSize * this.flatness);
        }
      }
    }
    else if (this.drawStep < 1) {
      ellipse(0, 0, this.r, this.r*this.flatness);
      if (p.nucleus) {
        if (this.fertile) {
          fill(0); ellipse(0, 0, this.cellEndSize, this.cellEndSize * this.flatness);
        }
        else {
          fill(255); ellipse(0, 0, this.cellEndSize, this.cellEndSize * this.flatness);
        }
      }
      this.drawSwitch = false;
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
    // Decrease collision counters. NOTE Only done on spawn, so is more like a 'spawn limit'
    this.collCount--;
    other.collCount--;

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
    if (p.debugCellPrintln) {print("spawncolor 1) this.fillColor= " + this.fillColor);}
    if (p.debugCellPrintln) {print("spawncolor 2) other.fillColor= " + other.fillColor);}
    this.childFillColor = lerpColor(this.fillColor, other.fillColor, 0.5);
    
    if (p.debugCellPrintln) {print("spawncolor 3): this.childFillColor= " + this.childFillColor);}

    // Calculate new stroke colour for child
    this.childStrokeColor = lerpColor(this.strokeColor, other.strokeColor, 0.5);
  
    // Call spawn method (in Colony) with the new parameters for position, velocity, colour & starting radius)
    if (p.spawning) {colony.spawn(this.spawnPos, this.spawnVel, this.childFillColor, this.childStrokeColor, this.r);}

    //Reset fertility counter
    this.fertility *= this.fertility;
    other.fertility *= other.fertility;
  }

  this.cellDebuggerText = function() {
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
    text("size:" + this.size, this.position.x, this.position.y + rowHeight*1);
    //text("growth:" + this.growth, this.position.x, this.position.y + rowHeight*5);
    text("maturity:" + this.maturity, this.position.x, this.position.y + rowHeight*4);
    text("lifespan:" + this.lifespan, this.position.x, this.position.y + rowHeight*2);
    text("age:" + this.age, this.position.x, this.position.y + rowHeight*3);
    //text("fertility:" + this.fertility, this.position.x, this.position.y + rowHeight*8);
    //text("fertile:" + this.fertile, this.position.x, this.position.y + rowHeight*9);
    //text("collCount:" + this.collCount, this.position.x, this.position.y + rowHeight*3);
    
    // MOVEMENT
    //text("vel.x:" + this.velocity.x, this.position.x, this.position.y + rowHeight*4);
    //text("vel.y:" + this.velocity.y, this.position.x, this.position.y + rowHeight*5);
    text("vel.heading():" + this.velocity.heading(), this.position.x, this.position.y + rowHeight*0);
  };

  this.cellDebuggerPrintln = function() {
    //println("Cell debug in terminal ON")
    //println("cell.debugger/" + "position.x" + this.position.x + "position.y" + this.position.y);
    //println("cell.debugger/" + "radius" + this.r);
  };
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