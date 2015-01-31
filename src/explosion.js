'use strict';

var Explosion = function(game, x, y, w, h) {
  Phaser.Sprite.call(this, game, x, y, 'boom', 0);

  var centerEnemyX = x + (w / 2);
  var centerEnemyY = y + (h / 2);
  var centerX = x + (this.width / 2);
  var centerY = y + (this.height / 2);
  this.x = x - (centerX - centerEnemyX);
  this.y = y - (centerY - centerEnemyY);

  var anim = this.animations.add('main', null, 40, false);
  this.animations.play('main');
  anim.onComplete.add(this.die, this);
  this.explosionSound = this.game.add.audio('explosion');
  this.explosionSound.play();

  this.game.add.existing(this);
};

Explosion.prototype = Object.create(Phaser.Sprite.prototype);
Explosion.prototype.constructor = Explosion;

Explosion.prototype.update = function() {
  if (!this.alive) {
    this.destroy();
  }
};

Explosion.prototype.die = function(self) {
  self.kill();
};
