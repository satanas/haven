'use strict';

var Diamond = function(game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'diamond', 0);

  this.game.physics.arcade.enable(this);
  this.body.setSize(16, 12, 8, 10);
  this.body.allowGravity = true;
  this.itemType = 'diamond';
  groups.items.add(this);
};

Diamond.prototype = Object.create(Phaser.Sprite.prototype);
Diamond.prototype.constructor = Diamond;

Diamond.prototype.update = function() {
  this.game.physics.arcade.collide(this, groups.tiles);
};

var ExtraLife = function(game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'extralife', 0);

  this.game.physics.arcade.enable(this);
  this.body.allowGravity = true;
  this.body.setSize(28, 24, 2, 4);
  this.itemType = 'extralife';
  groups.items.add(this);
};

ExtraLife.prototype = Object.create(Phaser.Sprite.prototype);
ExtraLife.prototype.constructor = ExtraLife;

ExtraLife.prototype.update = function() {
  this.game.physics.arcade.collide(this, groups.tiles);
};

var Heart = function(game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'heart', 0);

  this.game.physics.arcade.enable(this);
  this.body.setSize(16, 16, 0, 0);
  this.body.allowGravity = false;
  this.body.velocity.y = 50;
  this.itemType = 'heart';
  this.frame = 0;
  groups.items.add(this);
};

Heart.prototype = Object.create(Phaser.Sprite.prototype);
Heart.prototype.constructor = Heart;

Heart.prototype.update = function() {
  this.game.physics.arcade.collide(this, groups.tiles);
};
