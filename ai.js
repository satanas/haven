'use strict';

var AI = {
  simpleMove: function() {
    if (this.body.onWall() || (this.x >= this.game.world.width - this.width) || (this.x <= 0)) {
      this.body.velocity.x = 0;
      if (this.facing === 'right') {
        console.log('blocked right');
        this.x -= 1;
        this.facing = 'left';
      } else {
        console.log('blocked left');
        this.x += 1;
        this.facing = 'right';
      }
    } else {
      if (this.facing === 'left') {
        console.log('walking left');
        this.body.velocity.x = -this.speed;
        if (this.x <= this.x1) {
          this.facing = 'right';
          this.body.velocity.x = this.speed;
        }
      } else if (this.facing === 'right') {
        console.log('walking right');
        this.body.velocity.x = this.speed;
        if (this.x >= this.x2) {
          this.facing = 'left';
          this.body.velocity.x = -this.speed;
        }
      }
    }
  }
};
