'use strict';

var AI = {
  simpleMove: function() {
    var onWall = this.body.onWall();
    var onLimits = this.onWalkingLimits();
    var onWorldBounds = (this.body.x >= this.game.world.width - this.width) || (this.body.x <= 0);

    if (onWall || onLimits || onWorldBounds) {
      this.body.velocity.x = 0;
      if (this.body.x < 0) this.body.x = 0;
      if (this.body.x < this.minX) this.body.x = this.minX;
      if (this.body.x > this.maxX) this.body.x = this.maxX;
      if (this.body.x >= this.game.world.width - this.width) this.body.x = this.game.world.width - this.width;
      var x = this.body.x;

      if (this.facing === 'right') {
        this.facing = 'left';
        this.adjustHitBox();
        this.x = x - this.body.offset.x - 1;
      } else {
        this.facing = 'right';
        this.adjustHitBox();
        this.x = x + this.body.offset.x + 1;
      }
    } else {
      if (this.facing === 'right') {
        this.body.velocity.x = this.speed;
      } else {
        this.body.velocity.x = -this.speed;
      }
    }
  },

  isPlayerNear: function(range) {
    return Math.abs(this.player.x - this.x) <= range;
  }
};
