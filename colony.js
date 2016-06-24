// Colony class

// CONSTRUCTOR: Create a 'Colony' object, initially populated with 'colonySize' cells
function Colony(colonySize, cellStartSize_) {
  // Start with an array for all cells
  this.cells = [];

  // VARIABLES
  var colonyMaxSize = 500; // This could be varied in the GUI but 500 seems to be an OK value

  // Create initial population of cells
  for (var i = 0; i < colonySize; i++) {
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
    if (p.debug) {this.colonyDebugger(); }

    // Iterate backwards through the ArrayList because we are removing items
    for (var i = this.cells.length - 1; i >= 0; i--) {
      var c = this.cells[i]; // Get one cell at a time
      c.run(); // Run it (grow, move, spawn, check position vs boundaries etc.)
      if (c.dead()) {this.cells.splice(i, 1); // If cell has died, remove it from the array
      }

      // Iteration to check collision between current cell(i) and the rest
      if (this.cells.length <= colonyMaxSize) { // Don't check for collisons if there are too many cells (wait until some die off)
        if (c.fertile) { //Only do the check on cells that are fertile
          for (var others = i - 1; others >= 0; others--) { // Since main iteration (i) goes backwards, this one needs to too
            var other = this.cells[others]; // Get the other cells, one by one
            if (other.fertile) {c.checkCollision(other);} // Only check for collisions when both cells are fertile
          }
        }
      }
    }

    // If there are too many cells, remove some by 'culling'
    if (this.cells.length > colonyMaxSize) {
      this.cull(colonyMaxSize);
    }
  };

  this.cull = function(div) { // To remove a proportion of the cells from (the oldest part of) the colony
    var cull = (this.cells.length / div);
    for (var i = cull; i >= 0; i--) { this.cells.splice(i,1); }
  };

  this.colonyDebugger = function() { // Displays some values as text at the top left corner (for debug only)
    fill(0);
    rect(0,0,300,20);
    fill(360, 100);
    textSize(16);
    text("Nr. cells: " + this.cells.length + " MaxLimit:" + colonyMaxSize, 10, 20);
  };
}
