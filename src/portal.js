'use strict';

var Portal = function(x, y) {
  Phaser.Sprite.call(this, game, x, y, 'portal', 0);

  game.physics.arcade.enable(this);
  this.body.allowGravity = false;
  this.body.sensor = true;

  this.animations.add('main', null, 20, true);
  this.animations.play('main');
  groups.portals.add(this);
};

Portal.prototype = Object.create(Phaser.Sprite.prototype);
Portal.prototype.constructor = Portal;
