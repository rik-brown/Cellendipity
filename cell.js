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
  this.lifespan = lerp(p.lifespan, (p.lifespan * map(this.dna.genes[2], 0, 1, 0.8, 1.2)), p.variance*0.01); // Lifespan can be lowered by DNA but not increased
  this.fertility = lerp(p.fertileStart*0.01, (p.fertileStart*0.01 * map(this.dna.genes[14], 0, 1, 0.7, 1.0)), p.variance*0.01); // Fertility can be lowered by DNA but not increased
  this.spawnCount = int(p.spawnLimit); // Max. number of spawns

  // SIZE AND SHAPE
  this.cellStartSize = lerp(cellStartSize_, (cellStartSize_ * map(this.dna.genes[1], 0, 1, 0.8, 1.0)), p.variance*0.01); // Note: If last value in map() is >1 then new cells may be larger than their parents
  this.cellEndSize = lerp(p.cellEndSize, (p.cellEndSize * map(this.dna.genes[2], 0, 1, 1.0, 2.0)), p.variance*0.01);
  this.r = this.cellStartSize; // Initial value for radius
  this.size = map(this.r, this.cellStartSize, this.cellEndSize, 1, 0);
  this.flatness = lerp(p.flatness*0.01, (p.flatness*0.01 * map(this.dna.genes[13], 0, 1, 0.8, 1.2)), p.variance*0.01) +1; // To make circles into ellipses
  this.growth = (this.cellStartSize-this.cellEndSize)/p.lifespan; // Should work for both large>small and small>large
  this.drawStep = 1;
  this.drawStepN = 1;

  // MOVEMENT
  this.position = pos; //cell has position
  this.velocityLinear = vel; //cell has unique basic velocity component
  this.noisePercent = lerp(p.noisePercent, (p.noisePercent * map(this.dna.genes[3], 0, 1, 0.8, 1.2)), p.variance*0.01); // Spiral amount varies according to gene[4]
  this.spiral = lerp(p.spiral, (p.spiral * map(this.dna.genes[4], 0, 1, 0.8, 1.2)), p.variance*0.01); // Spiral amount varies according to gene[4]
  this.vMax = map(this.dna.genes[4], 0, 1, 0, 4); //Maximum magnitude in velocity components generated by noise
  this.xoff = random(1000); //Seed for noise
  this.yoff = random(1000); //Seed for noise
  this.step = map(this.dna.genes[3], 0, 1, 0.001, 0.006); //Step-size for noise

  // COLOUR

  // FILL COLOR
  this.fill_H = lerp(hue(fillColor_), (hue(fillColor_) * map(this.dna.genes[5], 0, 1, 0.95, 1.05)), p.variance*0.01);
  this.fill_S = lerp(saturation(fillColor_), (saturation(fillColor_) * map(this.dna.genes[6], 0, 1, 0.9, 1.1)), p.variance*0.01);
  this.fill_B = lerp(brightness(fillColor_), (brightness(fillColor_) * map(this.dna.genes[7], 0, 1, 0.9, 1.1)), p.variance*0.01);
  this.fillColor = color(this.fill_H, this.fill_S, this.fill_B); // Initial color is set
  this.fillAlpha = lerp(p.fillAlpha, (p.fillAlpha * map(this.dna.genes[8], 0, 1, 0.9, 1.1)), p.variance*0.01);

  //STROKE COLOR
  this.stroke_H = lerp(hue(strokeColor_), (hue(strokeColor_) * map(this.dna.genes[9], 0, 1, 0.95, 1.05)), p.variance*0.01);
  this.stroke_S = lerp(saturation(strokeColor_), (saturation(strokeColor_) * map(this.dna.genes[10], 0, 1, 0.9, 1.1)), p.variance*0.01);
  this.stroke_B = lerp(brightness(strokeColor_), (brightness(strokeColor_) * map(this.dna.genes[11], 0, 1, 0.9, 1.1)), p.variance*0.01);
  this.strokeColor = color(this.stroke_H, this.stroke_S, this.stroke_B); // Initial color is set
  this.strokeAlpha = lerp(p.strokeAlpha, (p.strokeAlpha * map(this.dna.genes[12], 0, 1, 0.9, 1.1)), p.variance*0.01);

  // Variables for LINEAR MOVEMENT WITH COLLISIONS
  this.m = this.r * 0.1; // Mass (sort of)

  this.run = function() {
    this.live();
    this.updatePosition();
    if (p.growing) {this.updateSize();}
    this.updateFertility();
    this.updateColor();
    if (p.wraparound) {this.checkBoundaryWraparound();}
    this.display();
    if (p.debug) {this.cellDebugger(); }
  }

  this.live = function() {
    this.age += 1;
    this.maturity = map(this.age, 0, this.lifespan, 1, 0);
    this.drawStep--;
    //this.drawStepStart = (this.r *2 + this.growth) * p.stepSize*0.01;
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
    this.velocity = p5.Vector.lerp(this.velocityLinear, velocityNoise, p.noisePercent*0.01);
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
    if (p.fill_STwist) {this.fill_S = map(this.size, 1, 0, 128, 255); this.fillColor = color(this.fill_H, this.fill_S, this.fill_B);} // Modulate fill saturation by radius
    if (p.fill_BTwist) {this.fill_B = map(this.size, 1, 0, 128, 255); this.fillColor = color(this.fill_H, this.fill_S, this.fill_B);} // Modulate fill brightness by radius
    if (p.fill_ATwist) {this.fillAlpha = map(this.size, 1, 0, 0, 255);} // Modulate fill Alpha by radius
    if (p.fill_HTwist) { // Modulate fill hue by radius. Does not change original hue value but replaces it with a 'twisted' version
      this.fill_Htwisted = map(this.size, 1, 0, this.fill_H, this.fill_H+60);
      if (this.fill_Htwisted > 360) {this.fill_Htwisted -= 360;}
      this.fillColor = color(this.fill_Htwisted, this.fill_S, this.fill_B); //fill colour is updated with new hue value
    }
    if (p.stroke_STwist) {this.stroke_S = map(this.size, 1, 0, 128, 255); this.strokeColor = color(this.stroke_H, this.stroke_S, this.stroke_B);} // Modulate stroke saturation by radius
    if (p.stroke_BTwist) {this.stroke_B = map(this.size, 1, 0, 128, 255); this.strokeColor = color(this.stroke_H, this.stroke_S, this.stroke_B);} // Modulate stroke brightness by radius
    if (p.stroke_ATwist) {this.strokeAlpha = map(this.size, 1, 0, 0, 255);} // Modulate stroke Alpha by radius
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
    if (this.position.x > width + this.r*this.flatness) {
      this.position.x = -this.r*this.flatness;
    } else if (this.position.x < -this.r*this.flatness) {
      this.position.x = width + this.r*this.flatness;
    } else if (this.position.y > height + this.r*this.flatness) {
      this.position.y = -this.r*this.flatness;
    } else if (this.position.y < -this.r*this.flatness) {
      this.position.y = height + this.r*this.flatness;
    }
  }

  // Death
  this.dead = function() {
    if (this.size <= 0) {return true;} // Size = 0 when r = cellEndSize
    if (this.age >= this.lifespan) {return true;} // Death by old age (regardless of size, which may remain constant)
    if (this.position.x > width + this.r*this.flatness || this.position.x < -this.r*this.flatness || this.position.y > height + this.r*this.flatness || this.position.y < -this.r*this.flatness) {return true;} // Death if move beyond canvas boundary
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

  this.checkCollision = function(other) { // Method receives a Cell object 'other' to get the required info about the collidee
    var distVect = p5.Vector.sub(other.position, this.position); // Static vector to get distance between the cell & other
    var distMag = distVect.mag(); // calculate magnitude of the vector separating the balls
    if (distMag < (this.r + other.r)) {this.conception(other, distVect);} // Spawn a new cell
  }



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

  this.cellDebugger = function() { // Displays cell parameters as text (for debug only)
    var rowHeight = 15;
    fill(255);
    textSize(rowHeight);
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
