'use strict';

var Diamond = function(game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'diamond', 0);

  this.game.physics.arcade.enable(this);
  this.body.allowGravity = false;
  this.body.setSize(16, 12, 8, 10);
  this.type = 'diamond';
  groups.items.add(this);
};

Diamond.prototype = Object.create(Phaser.Sprite.prototype);
Diamond.prototype.constructor = Diamond;

var ExtraLife = function(game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'extralife', 0);

  this.game.physics.arcade.enable(this);
  this.body.allowGravity = false;
  this.body.setSize(28, 24, 2, 4);
  this.type = 'extralife';
  groups.items.add(this);
};

ExtraLife.prototype = Object.create(Phaser.Sprite.prototype);
ExtraLife.prototype.constructor = ExtraLife;
