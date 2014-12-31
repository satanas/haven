'use strict';

var Checkpoint = function(game, x, y, origX, origY) {
  Phaser.Sprite.call(this, game, x, y, 'checkpoint', 0);

  this.origX = origX;
  this.origY = origY;
  this.activated = false;
  this.game.physics.arcade.enable(this);
  this.body.allowGravity = false;
  this.body.sensor = true;

  groups.checkpoints.add(this);
};

Checkpoint.prototype = Object.create(Phaser.Sprite.prototype);
Checkpoint.prototype.constructor = Checkpoint;
