'use strict';

var AI = {
  simpleMove: function() {
    var onWall = this.body.onWall();
    var onLimits = (this.x <= this.x1) || (this.x >= this.x2);
    var onWorldBounds = (this.x >= this.game.world.width - this.width) || (this.x <= 0);

    if (onWall || onLimits || onWorldBounds) {
      this.body.velocity.x = 0;
      if (this.x < 0) this.x = 0;
      if (this.x < this.x1) this.x = this.x1;
      if (this.x > this.x2) this.x = this.x2;
      if (this.x >= this.game.world.width - this.width) this.x = this.game.world.width - this.width;

      if (this.facing === 'right') {
        this.x -= 1;
        this.facing = 'left';
      } else {
        this.x += 1;
        this.facing = 'right';
      }
    } else {
      if (this.facing === 'right') {
        this.body.velocity.x = this.speed;
      } else {
        this.body.velocity.x = -this.speed;
      }
    }
  }
};
