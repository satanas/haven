'use strict';

var Spike = function(game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'spikes', 0);

  this.game.physics.arcade.enable(this);
  this.body.allowGravity = false;
  this.body.setSize(32, 24, 0, 8);
  groups.enemies.add(this);
};

Spike.prototype = Object.create(Phaser.Sprite.prototype);
Spike.prototype.constructor = Spike;
