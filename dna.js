// DNA class
// This is a copy from the original 'Nature of Code' example 'Evolution EcoSystem'
// by Daniel Shiffman <http://www.shiffman.net>
// NOTE: 'copy()' and 'mutate()' are not in use


// Constructor (makes a random DNA with 15 genes)
function DNA(newgenes) {
  if (newgenes) {
    this.genes = newgenes;
  } else {
    // The genetic sequence
    // DNA is random floating point values between 0 and 1
    this.genes = new Array(15);
    for (var i = 0; i < this.genes.length; i++) {
      this.genes[i] = random(0, 1);
    }
  }

  this.copy = function() {
    var newgenes = [];
    for (var i = 0; i < this.genes.length; i++) {
      newgenes[i] = this.genes[i];
    }
    return new DNA(newgenes);
  }

  // Based on a mutation probability 'm', picks a new random character in array spots
  this.mutate = function(m) {
    for (var i = 0; i < this.genes.length; i++) {
      if (random(1) < m) {
        this.genes[i] = random(0, 1);
      }
    }
  }

}
