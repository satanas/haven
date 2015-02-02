'use strict';

var AI = {
  simpleMove: function() {
    var onWall = this.body.onWall();
    var onLimits = this.onWalkingLimits();
    var onWorldBounds = (this.body.x >= this.game.world.width - this.width) || (this.body.x <= 0);
    var onTileBorder = false;
    var xx = null;

    if (this.map !== undefined) {
      if (this.facing === 'left')
        xx = Math.ceil((this.x) / 32) - 1;
      else
        xx = Math.ceil((this.x) / 32);
      if (xx < 0) xx = 0;

      var yy = Math.ceil((this.y + this.height) / 32) - 1;
      //console.log('hasTile', this.facing, xx, yy, this.map.hasTile(xx, yy, 'Tiles'));
      onTileBorder = !this.map.hasTile(xx, yy, 'Tiles');
    }

    //console.log(onWall, onLimits, onWorldBounds, onTileBorder, this.x, this.y);
    if (onWall || onLimits || onWorldBounds || onTileBorder) {
      //console.log('before1', this.x, this.body.x, this.minX, this.maxX);
      this.body.velocity.x = 0;
      if (this.body.x < 0) this.body.x = 0;
      if ((this.minX >= 0) && (this.body.x < this.minX)) this.body.x = this.minX;
      if ((this.maxX >= 0) && (this.body.x > this.maxX)) this.body.x = this.maxX;
      if (this.body.x >= this.game.world.width - this.width) this.body.x = this.game.world.width - this.width;
      var x = this.body.x;
      //console.log('before2', this.x, this.body.x, this.y);

      if (this.facing === 'right') {
        this.facing = 'left';
        this.adjustHitBox();
        this.x = x - this.body.offset.x - 1;
      } else {
        this.facing = 'right';
        this.adjustHitBox();
        this.x = x + this.body.offset.x + 1;
      }
      //console.log(onWall, onLimits, onWorldBounds, onTileBorder, this.x, this.y);
    } else {
      if (this.facing === 'right') {
        this.body.velocity.x = this.speed;
      } else {
        this.body.velocity.x = -this.speed;
      }
    }

    //if (this.map === undefined) return;

    //if (this.facing === 'left')
    //  var x = Math.ceil((this.x) / 32) - 1;
    //else
    //  var x = Math.ceil((this.x + this.width) / 32);
    //if (x < 0) x = 0;

    //var y = Math.ceil((this.y + this.height) / 32);
    ////console.log('hasTile', this.facing, x, y, this.map.hasTile(x, y, 'Tiles'));
    //if (!this.map.hasTile(x, y, 'Tiles')) {
    //  if (this.facing === 'left')
    //    this.facing = 'right';
    //  else
    //    this.facing = 'left';
    //}
  },

  isPlayerNear: function(range) {
    var playerCenter = this.player.x + (this.player.width / 2);
    var objCenter = this.x + (this.width / 2);
    return Math.abs(playerCenter - objCenter) <= range;
  }
};
