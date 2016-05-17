/*
 * 2016.05.13 21:01
 * New branch: Issue 11 Fixing ColorTwist
 * Missing/broken feature
 * Colour parameters (esp. saturation & brightness) are modulated
 * as radius progresses from start- to end-size
 *
 * Ideas for menu headings:
 * Modifiers (for colortwisting etc.)
 * Variance (for degree of influence from DNA)
 *
 * 14.05 15:53 Added new cell variable 'size'
 * 15.05 16:26 Updates made in the GUI have no effect, sometimes..???
 * 17.05 23:13 Continuing with 'size'
 */

var sketchContainer = "sketch";
var guiContainer = "sketch-gui";

var colony; // A colony object


function setup() {
  //frameRate(10); // Useful for debugging
  colorMode(HSB, 360, 100, 100, 100);
  createCanvas(windowWidth, windowHeight - 4);
  smooth();
  ellipseMode(RADIUS);
  
  p = new parameters();
  //print (p);
  gui = new dat.GUI();
  //dat.GUI.toggleHide();
  initGUI();
  
  background(p.bkgColor);
  colony = new Colony(p.colonySize, p.cellStartSize);
}

function draw() {
  if (!p.trails || p.debugCellText) {background(p.bkgColor);}
  if (p.veils) {veil();} // Draws a near-transparent 'veil' in background colour over the  frame
  colony.run();
  if (colony.cells.length === 0 && keyIsPressed) {
    //p = new parameters();
    // Repopulate the colony if it suffers an extinction
    //screendump(); //WARNING! Need to stop after doing this once!
    //veil();                       // Draw a veil over the previous colony to gradually fade it into oblivion
      background(p.bkgColor); // For greyscale background
    populateColony();
  }
}

function populateColony() {
  colony = new Colony(p.colonySize, p.cellStartSize); //Could Colony receive a color-seed value (that is iterated through in a for- loop?) (or randomized?)
 // colony = new Colony(10, cellStartSize); // Populate the colony with a single cell. Useful for debugging
}

function veil() {
  var transparency = 1; // 255 is fully opaque, 1 is virtually invisible
  noStroke();
  fill(hue(p.bkgColor), saturation(p.bkgColor), brightness(p.bkgColor), transparency);
  rect(-1, -1, width + 1, height + 1);
}

// We can add a creature manually if we so desire
function mousePressed() {
  var mousePos = createVector(mouseX, mouseY);
  if (mousePos.x < width) {
    if (p.debugMain) {print("xx " + String(mousePos));}
    if (p.debugMain) {print("yy " + String(p.cellFillColor));}
    if (p.debugMain) {print("zz " + String(p.cellStrokeColor));}
    //println("cellFillColor: " + p.cellFillColor + "   cellFillAlpha: " + p.cellFillAlpha);
    //println("cellStrokeColor: " + p.cellStrokeColor + "   cellStrokeAlpha: " + p.cellStrokeAlpha);
    colony.spawn(mousePos, p.cellFillColor, p.cellStrokeColor, p.cellStartSize);
  }
}

function mouseDragged() {
  var mousePos = createVector(mouseX, mouseY);
  if (mousePos.x < width) {
    if (p.debugMain) {print("xx " + String(mousePos));}
    if (p.debugMain) {print("yy " + String(p.cellFillColor));}
    if (p.debugMain) {print("zz " + String(p.cellStrokeColor));}
    //println("cellFillColor: " + p.cellFillColor + "   cellFillAlpha: " + p.cellFillAlpha);
    //println("cellStrokeColor: " + p.cellStrokeColor + "   cellStrokeAlpha: " + p.cellStrokeAlpha);
    colony.spawn(mousePos, p.cellFillColor, p.cellStrokeColor, p.cellStartSize);
  }
}

function screendump() {
  saveCanvas('test', 'png');
}

function keyTyped() {
  if (key === 'b') {
    var spawnPos = createVector(random(width), random(height));
    var testFillColor = color(240, 100, 100); //BLUE
    var testStrokeColor = color(0, 0, 100);
    if (p.debugMain) {print(String(testFillColor));}
    colony.spawn(spawnPos, testFillColor, testStrokeColor, p.cellStartSize);
    //screendump();
  }
  
  if (key === 'g') {
    var spawnPos = createVector(random(width), random(height));
    var testFillColor = color(120, 100, 100); //GREEN
    var testStrokeColor = color(0, 0, 100);
    if (p.debugMain) {print(String(testFillColor));}
    colony.spawn(spawnPos, testFillColor, testStrokeColor, p.cellStartSize);
    //screendump();
  }
  
  if (key === 'r') {
    var spawnPos = createVector(random(width), random(height));
    var testFillColor = color(0, 100, 100); //RED
    var testStrokeColor = color(0, 0, 100);
    if (p.debugMain) {print(String(testFillColor));}
    colony.spawn(spawnPos, testFillColor, testStrokeColor, p.cellStartSize);
    //screendump();
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
}

var initGUI = function () {

// Add the GUI sections
	var f1 = gui.addFolder('Cells');
	  var controller = f1.add(p, 'colonySize', 2, 200).step(1).name('Colony start size');
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
	  f1.add(p, 'growth', 0, 1).step(0.01).name('Growth rate');
	  var controller = f1.add(p, 'fertileStart', 0.5, 0.95).step(0.01).name('Fertile radius%');
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
	  var controller = f4.addColor(p, 'cellFillColHSV').name('Cell Fill Colour');
	    controller.onChange(function(value) {
	      p.cellFillColor = color(value.h, value.s*100, value.v*100);
	    });
	  var controller = f4.add(p, 'cellFillAlpha', 0, 100).name('Cell Fill Alpha');
	    controller.onChange(function(value) {populateColony();});
    f4.add(p, 'cellFill_HTwist').name('Hue twist');
    f4.add(p, 'cellFill_STwist').name('Saturation twist');
    f4.add(p, 'cellFill_BTwist').name('Brightness twist');
    f4.add(p, 'cellFill_ATwist').name('Alpha twist');
	    
	    
	var f5 = gui.addFolder("Cell Stroke");
	  var controller = f5.addColor(p, 'cellStrokeColHSV').name('Cell Stroke Colour');
	    controller.onChange(function(value) {
	      p.cellStrokeColor = color(value.h, value.s*100, value.v*100);
	    });
	  var controller = f5.add(p, 'cellStrokeAlpha', 0, 100).name('Cell Stroke Alpha');
	    controller.onChange(function(value) {populateColony();});
    f5.add(p, 'cellStroke_HTwist').name('Hue twist');
    f5.add(p, 'cellStroke_STwist').name('Saturation twist');
    f5.add(p, 'cellStroke_BTwist').name('Brightness twist');
    f5.add(p, 'cellStroke_ATwist').name('Alpha twist');	    
	    
	    
	    
	    
  var f6 = gui.addFolder("Options");
    f6.add(p, 'moving').name('Moving');
    f6.add(p, 'perlin').name('Perlin');
    f6.add(p, 'spawning').name('Spawning');
    f6.add(p, 'growing').name('Growing');
    f6.add(p, 'coloring').name('Coloring');
    
    f6.add(p, 'nucleus').name('Show nucleus');
    
  var f7 = gui.addFolder("Debug");
    f7.add(p, 'debugMain').name('Debug:Main');
    f7.add(p, 'debugCellText').name('Debug:Cell(txt)');
    f7.add(p, 'debugCellPrintln').name('Debug:Cell(print)');
    f7.add(p, 'debugColony').name('Debug:Colony');

}


var parameters = function () {
  this.colonySize = int(random (5,15)); // Max number of cells in the colony
  this.bkgColHSV = { h: random(360), s: random(), v: random() };
  this.bkgColor = color(this.bkgColHSV.h, this.bkgColHSV.s*100, this.bkgColHSV.v*100); // Background colour
  this.cellFillColHSV = { h: random(360), s: random(), v: random() };
  this.cellFillColor = color(this.cellFillColHSV.h, this.cellFillColHSV.s*100, this.cellFillColHSV.v*100); // Cell colour
  this.cellFillAlpha = random(100);
  this.cellStrokeColHSV = { h: random(360), s: random(), v: random() };
  this.cellStrokeColor = color(this.cellStrokeColHSV.h, this.cellStrokeColHSV.s*100, this.cellStrokeColHSV.v*100); // Cell colour
  this.cellStrokeAlpha = random(100);
  this.cellStartSize = random(30,120); // Cell radius at spawn
  this.cellEndSize = 2;
  this.growth = 0.08;
  this.fertileStart = 0.9; // Cell becomes fertile when size has shrunk to this % of startSize
  this.wraparound = true; // If true, cells leaving the canvas will wraparound, else rebound from walls
  this.trails = true;
  this.veils = false;
  this.moving = true;
  this.perlin = true;
  this.spawning = true;
  this.growing = true;
  this.coloring = true;
  this.cellFill_HTwist = false;
  this.cellFill_STwist = false;
  this.cellFill_BTwist = false;
  this.cellFill_ATwist = false;
  this.cellStroke_HTwist = false;
  this.cellStroke_STwist = false;
  this.cellStroke_BTwist = false;
  this.cellStroke_ATwist = false;
  this.nucleus = false;
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
  var colonyMax = 200;
  var colRand = random(-PI, PI);
  
  // Create initial population of cells  
  for (var i = 0; i < num; i++) {
    var pos = createVector(random(width), random(height)); // Initial position vector is random
    //var pos = createVector(width/2, height/2);           // Initial position vector is center of canvas
    var dna = new DNA(); // Get new DNA
    this.cells.push(new Cell(pos, p.cellFillColor, p.cellStrokeColor, dna, p.cellStartSize)); // Add new Cell with DNA
  }

  this.spawn = function(mousePos, cellFillColor_, cellStrokeColor_, cellStartSize_) {
    // Spawn a new cell (called by e.g. MousePressed in main, accepting mouse coords for start position)
    var dna = new DNA();
    var cellStartSize = cellStartSize_;
    var cellFillColor = cellFillColor_;
    var cellStrokeColor = cellStrokeColor_;
    if (p.debugCellPrintln) {
      println("01 About to spawn with hue(cellFillColor)= " + hue(cellFillColor));
      print("02 String(cellFillColor)= " + String(cellFillColor));
    }
    this.cells.push(new Cell(mousePos, cellFillColor, cellStrokeColor, dna, cellStartSize));
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
      this.cull(100);
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
function Cell(pos, cellFillColor_, cellStrokeColor_, dna_, cellStartSize_) {

  //  Objects
  
  this.dna = dna_;

  // DNA gene mapping (14 genes)
  // 0 = cellStartSize
  // 1 = cellEndSize
  // 2 = growth
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
  // 13 = Ellipse flatness
  // 14 = Fertility

  // BOOLEAN
  this.fertile = false; // A new cell always starts of infertile
  /* e.g
  * this.spiralling
  * this.transforming
  * this.coloring
  * this.colortwisting
  * this.perlin
  * this.stepped
  */

  // GROWTH & REPRODUCTION
  this.age = 0; // Age is 'number of frames since birth'. A new cell always starts with age = 0. What is it used for?
  this.fertility = p.fertileStart * map(this.dna.genes[14], 0, 1, 0.7, 1.0); // Fertility can be lowered by DNA but not increased
  this.health = 300; // Number of frames     before DEATH
  this.collCount = 3; // Number of collisions before DEATH
  
  // SIZE AND SHAPE
  this.cellStartSize = cellStartSize_ * map(this.dna.genes[1], 0, 1, 0.8, 1.0); // Note: If last value in map() is >1 then new cells may be larger than their parents
  this.cellEndSize = p.cellEndSize * map(this.dna.genes[2], 0, 1, 1.0, 2.0);
  this.r = this.cellStartSize; // Initial value for radius
  this.size = this.r / this.cellStartSize; //A measure of progress from startSize to EndSize (an alternative indicator of age)
  this.flatness = map(this.dna.genes[13], 0, 1, 1, 1.3); // To make circles into ellipses
  //this.growth = p.growth;
  this.growth = p.growth * map(this.dna.genes[2], 0, 1, 0.8, 1.2); // Rate at which radius grows
  //this.drawStep = this.r * 2 / this.velocity.mag(); // Used in subroutine in display() to draw ellipse at stepped interval
  this.drawStep = this.r*2; // Alternative calculation (original guess)

  // COMMON
  this.position = pos.copy(); //cell has position
  this.velocity = p5.Vector.random2D(); //cell has velocity

  // PERLIN
  this.vMax = map(this.dna.genes[4], 0, 1, 0, 4); //Maximum velocity when using movePerlin()
  this.xoff = random(1000); //Seed for noise
  this.yoff = random(1000); //Seed for noise
  this.step = map(this.dna.genes[3], 0, 1, 0.001, 0.006); //Step-size for noise

  // COLOUR

  // FILL COLOR
  //this.cellFillColor = cellFillColor_;
  this.cellFill_H = hue(cellFillColor_) * map(this.dna.genes[5], 0, 1, 0.9, 1.1)
  this.cellFill_S = saturation(cellFillColor_) * map(this.dna.genes[6], 0, 1, 0.8, 1.2)
  this.cellFill_B = brightness(cellFillColor_) * map(this.dna.genes[7], 0, 1, 0.7, 1.3)
  this.cellFillColor = color(this.cellFill_H, this.cellFill_S, this.cellFill_B);
  this.cellFillAlpha = p.cellFillAlpha * map(this.dna.genes[8], 0, 1, 0.8, 1.2);
  if (p.debugCellPrintln) {
    println("03 (in cell) this.cellFillColor= " + this.cellFillColor);
    println("04 (in cell) hue(this.cellFillColor)= " + hue(this.cellFillColor));
  }
  
  

  //STROKE COLOR
  //this.cellStrokeColor = cellStrokeColor_;
  this.cellStroke_H = hue(cellStrokeColor_) * map(this.dna.genes[9], 0, 1, 0.9, 1.1);
  this.cellStroke_S = saturation(cellStrokeColor_) * map(this.dna.genes[10], 0, 1, 0.8, 1.2);
  this.cellStroke_B = brightness(cellStrokeColor_) * map(this.dna.genes[11], 0, 1, 0.7, 1.3);
  this.cellStrokeColor = color(this.cellStroke_H, this.cellStroke_S, this.cellStroke_B);
  this.cellStrokeAlpha = p.cellStrokeAlpha * map(this.dna.genes[12], 0, 1, 0.8, 1.2);
 
  // COLOUR (other stuff)
  this.strokeOffset = random(-PI/2, PI/2); // Used in colorTwist to offset the stroke colour from the fill colour by this angle

  // Variables for LINEAR MOVEMENT WITH COLLISIONS
  this.m = this.r * 0.1; // Mass (sort of)

  this.run = function() {
    this.live();
    if (p.moving) {
      if (p.perlin) {this.movePerlin();} //will become a general 'updatePosition()' encompassing both Linear & Perlin
      else {this.moveLinear();}
    }
    //this.moveLinearStepped();
    //this.movePerlinStepped();
    if (p.growing) {this.updateSize();}
    if (p.spawning) {this.updateFertility();}
    if (p.coloring) {this.updateColor();}
    if (p.wraparound) {this.checkBoundaryWraparound();} else {this.checkBoundaryRebound();}
    this.display();
    if (p.debugCellText) {this.cellDebuggerText(); }
    if (p.debugCellPrintln) {this.cellDebuggerPrintln(); }
  };

  this.live = function() {
    this.age += 1;
    //this.health -= 1;
    this.drawStep--;
    //if (this.drawStep < 0) {this.drawStep = r*2; }
    if (this.drawStep < 0) {
      this.drawStep = this.r * 2 / this.velocity.mag();
    }
  };

  this.updateSize = function() {
    this.r -= this.growth; // Cell can only shrink for now
    this.size = this.r / this.cellStartSize;
  };

  this.updateFertility = function() {
    if (this.size <= this.fertility) { this.fertile = true; } else {this.fertile = false; } // A cell is fertile if r is within limit (a % of cellStartSize)
  };

  this.updateColor = function() {
    /* An improved version would be to make a generic "sizeModulator" which takes a value in
    * and returns a value which is modulated by the size of the current radius relative to start & end sizes
    * This could then be used to modulate any of the other parameters (fill or stroke colour, shape, etc. etc. Fertility?)
    *
    * Thinking out loud:
    * At any given time, this.r is somewhere between cellStartSize and cellEndSIze
    * Start = 1.0 (at 100% of size)
    * End = 0.0 (reached 'end size' or 0% of original size)
    * Fertile state is active when this fraction <= this.fertility
    * It also represents the 'age' of the cell, not measured in frames, but as progress from birth > death. Growth? Size? Size!
    */
    var twist = map(this.size, 1, 0, 0.5, 1.5);
    if (p.cellFill_HTwist) {this.cellFill_H *= twist;}
    if (p.cellStroke_HTwist) {this.cellFill_H *= twist;}
    
    if (p.cellFill_STwist) {this.cellFill_S = map(this.size, 1, 0, 0, 100);} // Modulate fill saturation by radius
    if (p.cellFill_BTwist) {this.cellFill_B = map(this.size, 1, 0, 0, 100);} // Modulate fill brightness by radius
    if (p.cellFill_ATwist) {this.cellFill_Alpha = map(this.size, 1, 0, 0, 100);} // Modulate fill Alpha by radius
    this.cellFillColor = color(this.cellFill_H, this.cellFill_S, this.cellFill_B);
    
    if (p.cellStroke_STwist) {this.cellStroke_S = map(this.size, 1, 0, 0, 100);} // Modulate fill saturation by radius
    if (p.cellStroke_BTwist) {this.cellStroke_B = map(this.size, 1, 0, 0, 100);} // Modulate fill brightness by radius
    if (p.cellStroke_ATwist) {this.cellStroke_Alpha = map(this.size, 1, 0, 0, 100);} // Modulate fill Alpha by radius
    this.cellStrokeColor = color(this.cellStroke_H, this.cellStroke_S, this.cellStroke_B);
  }
  
  this.color360 = function() {
    if (this.cellFill_H > 360) {this.cellFill_H -= 360;}
    if (this.cellFill_H < 0) {this.cellFill_H += 360;}
    this.cellFillColor = color(this.cellFill_H, this.cellFill_S, this.cellFill_B);
  }

  this.moveLinear = function() {
    // Simple linear movement at constant (initial) velocity
    this.position.add(this.velocity);
  };

  this.moveLinearStepped = function() {
    this.velocity.normalize(); // Convert to a unit-vector (magnitude = 1)
    //this.velocity.mult(this.r + this.r + this.growth); // Set the magnitude to a size which will place the two consecutive circles adjacent to one another.
    this.velocity.mult(this.r + this.r + p.growth); // Set the magnitude to a size which will place the two consecutive circles adjacent to one another.
    this.position.add(this.velocity);
  };

  this.movePerlin = function() {
    // Simple movement based on perlin noise
    var vx = map(noise(this.xoff), 0, 1, -this.vMax, this.vMax);
    var vy = map(noise(this.yoff), 0, 1, -this.vMax, this.vMax);
    var velocity = createVector(vx, vy);
    this.xoff += this.step;
    this.yoff += this.step;
    this.position.add(velocity);
  };

  this.movePerlinStepped = function() {
    // Experimental movement based on perlin noise
    var vx = map(noise(this.xoff), 0, 1, -this.vMax, this.vMax);
    var vy = map(noise(this.yoff), 0, 1, -this.vMax, this.vMax);
    var velocity = createVector(vx, vy); // The changing angle is already given. It is only the magnitude which needs to be adressed!
    this.xoff += this.step;
    this.yoff += this.step;
    velocity.normalize(); // Convert to a unit-vector (magnitude = 1)
    //velocity.mult(this.r + this.r + this.growth); // Set the magnitude to a size which will place the two consecutive circles adjacent to one another.
    velocity.mult(this.r + this.r + p.growth); // Set the magnitude to a size which will place the two consecutive circles adjacent to one another.
    this.position.add(velocity);
  };

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
  };

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
  };

  // Death
  this.dead = function() {
    //if (this.collCount <= 0 || this.r < this.cellEndSize || this.health <0) {return true; } 
    if (this.r < this.cellEndSize) {return true;} // Only radius kills cell
    else if (this.position.x > width + this.r || this.position.x < -this.r || this.position.y > height + this.r || this.position.y < -this.r) {return true;} // Death if move beyond canvas boundary
    else {return false;
    }
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

    //noStroke();
    //noFill();

    //stroke(p.cellStrokeColor, p.cellStrokeAlpha);
    stroke(hue(this.cellStrokeColor), saturation(this.cellStrokeColor), brightness(this.cellStrokeColor), this.cellStrokeAlpha);
    //fill(p.cellFillColor, p.cellFillAlpha);
    fill(hue(this.cellFillColor), saturation(this.cellFillColor), brightness(this.cellFillColor), this.cellFillAlpha);

    var angle = this.velocity.heading();
    push();
    translate(this.position.x, this.position.y);
    //rotate(angle);
    ellipse(0, 0, this.r, this.r * this.flatness);
    if (p.nucleus) {
      if (this.fertile) {
        fill(0); ellipse(0, 0, this.cellEndSize, this.cellEndSize);
      }
      else {
        fill(255); ellipse(0, 0, this.cellEndSize, this.cellEndSize);
      }
    }
    /*if (this.drawStep < 1) {
      fill(0, 80);
      //stroke(0);
      ellipse(0, 0, this.r, this.r*this.flatness);
    }*/
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
    if (p.debugCellPrintln) {print("spawncolor 1) this.cellFillColor= " + this.cellFillColor);}
    if (p.debugCellPrintln) {print("spawncolor 2) other.cellFillColor= " + other.cellFillColor);}
    this.childFillColor = lerpColor(this.cellFillColor, other.cellFillColor, 0.5);
    
    if (p.debugCellPrintln) {print("spawncolor 3): this.childFillColor= " + this.childFillColor);}

    // Calculate new stroke colour for child
    this.childStrokeColor = lerpColor(this.cellStrokeColor, other.cellStrokeColor, 0.5);
  
    // Calculate cellStartSize for child
    //this.cellStartSize = this.r; //Commented out 14.05@15:59 to avoid issue with colourtwisting (reset to cellStart causes colour to change)
    //other.cellStartSize = other.r;

    // Call spawn method (in Colony) with the new parameters for position, velocity and fill-colour)
    //colony.spawn(spawnPos.x, spawnPos.y, spawnVel.x, spawnVel.y, spawnCol.heading(), spawnCol.mag());
    if (p.spawning) {
      colony.spawn(this.spawnPos, this.childFillColor, this.childStrokeColor, this.r);} // changed 14.05@15:59 from this.cellStartSize to this.r

    //Reset fertility counter
    //this.fertility = 0;
    //other.fertility = 0;
  }

  this.cellDebuggerText = function() {
    var rowHeight = 15;
    fill(255);
    textSize(rowHeight);
    //text("Your debug text HERE", this.position.x, this.position.y);
    // RADIUS
    text("r:" + this.r, this.position.x, this.position.y);
    text("cellStartSize:" + this.cellStartSize, this.position.x, this.position.y + rowHeight);
    text("cellEndSize:" + this.cellEndSize, this.position.x, this.position.y + rowHeight*2);
    
    
    // COLOUR
    //text("this.cellFillCol:" + this.cellFillColor, this.position.x, this.position.y + rowHeight*1);
    //text("this.cellFillCol (hue):" + hue(this.cellFillColor), this.position.x, this.position.y + rowHeight*2);
    //text("this.cellStrokeCol:" + this.cellStrokeColor, this.position.x, this.position.y + rowHeight*2);
    
    // GROWTH
    text("size:" + this.size, this.position.x, this.position.y + rowHeight*3);
    //text("growth:" + this.growth, this.position.x, this.position.y + rowHeight*3);
    //text("age:" + this.age, this.position.x, this.position.y + rowHeight*4);
    //text("fertility:" + this.fertility, this.position.x, this.position.y + rowHeight*3);
    //text("fertile:" + this.fertile, this.position.x, this.position.y + rowHeight*4);
    //text("collCount:" + this.collCount, this.position.x, this.position.y + rowHeight*3);
    
    // MOVEMENT
    //text("vel.x:" + this.velocity.x, this.position.x, this.position.y + rowHeight*4);
    //text("vel.y:" + this.velocity.y, this.position.x, this.position.y + rowHeight*5);
    //text("vel.heading(deg):" + degrees(this.velocity.heading()), this.position.x, this.position.y + rowHeight*6);
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