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

  this.deadType = 'burn';
  this.game.physics.arcade.enable(this);
  this.body.allowGravity = false;
  this.body.setSize(32, 20, 0, 12);
  this.harm = 999;
  groups.enemies.add(this);
};

Lava.prototype = Object.create(Phaser.Sprite.prototype);
Lava.prototype.constructor = Lava;

var BearTrap = function(game, player, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'box-blue', 0);

  this.deadType = deadType.DECAPITATION;
  this.player = player;
  this.game.physics.arcade.enable(this);
  this.body.allowGravity = true;
  this.body.setSize(32, 10, 0, 22);
  this.harm = 999;
  this.activated = false;
  groups.enemies.add(this);
};

BearTrap.prototype = Object.create(Phaser.Sprite.prototype);
BearTrap.prototype.constructor = BearTrap;

BearTrap.prototype.update = function() {
  this.game.physics.arcade.collide(this, groups.tiles);
  this.game.physics.arcade.overlap(this, this.player, this.onActivation);
  if (this.activated) {
    this.tint = 0xcf00e2;
  }
};

BearTrap.prototype.onActivation = function(self, player) {
  player.x = self.x;
  this.activated = true;
};
