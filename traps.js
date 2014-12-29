'use strict';

var Spike = function(game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'spikes', 0);

  this.game.physics.arcade.enable(this);
  this.body.allowGravity = false;
  this.body.setSize(32, 24, 0, 8);
  this.harm = 999;
  groups.enemies.add(this);
};

Spike.prototype = Object.create(Phaser.Sprite.prototype);
Spike.prototype.constructor = Spike;

var Lava = function(game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'lava', 0);

  this.game.physics.arcade.enable(this);
  this.body.allowGravity = false;
  this.body.setSize(32, 20, 0, 12);
  this.harm = 999;
  groups.enemies.add(this);
};

Lava.prototype = Object.create(Phaser.Sprite.prototype);
Lava.prototype.constructor = Lava;
