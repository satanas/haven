'use strict';

var Bullet = function(game, x, y, direction) {
  Phaser.Sprite.call(this, game, x, y, 'bullet', 0);

  this.game.physics.arcade.enable(this);
  this.body.allowGravity = false;
  this.bringToTop();
  if (direction === 'left') {
    this.body.velocity.x = -1 * this.game.global.maxBulletSpeed;
  } else {
    this.body.velocity.x = this.game.global.maxBulletSpeed;
  }
};

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function() {
  this.game.physics.arcade.collide(this, groups.platforms, this.die);
};

Bullet.prototype.die = function(bullet, platform) {
  bullet.kill();
};
