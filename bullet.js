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
  groups.bullets.add(this);
};

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function() {
  this.game.physics.arcade.collide(this, groups.platforms, this.die);
  this.game.physics.arcade.collide(this, groups.enemies, this.makeDamage);
};

Bullet.prototype.die = function(self, platform) {
  self.kill();
};

Bullet.prototype.makeDamage = function(self, object) {
  object.takeDamage();
  self.kill();
};
