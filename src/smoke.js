'use strict';

var Smoke = function(x, y) {
  Phaser.Sprite.call(this, game, x, y, 'smoke', 0);

  this.x = x;
  this.y = y;

  var anim = this.animations.add('main', null, 30, false);
  anim.onComplete.add(this.die, this);
  this.animations.play('main');
  this.explosionSound = game.add.audio('explosion');
  this.explosionSound.play();

  game.add.existing(this);
};

Smoke.prototype = Object.create(Phaser.Sprite.prototype);
Smoke.prototype.constructor = Smoke;

Smoke.prototype.update = function() {
  if (!this.alive) {
    this.destroy();
  }
};

Smoke.prototype.die = function(self) {
  self.kill();
};
