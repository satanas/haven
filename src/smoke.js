'use strict';

var Smoke = function(x, y) {
  Phaser.Sprite.call(this, game, x, y, 'smoke', 0);

  this.x = x;
  this.y = y;
  //var centerEnemyX = x + (w / 2);
  //var centerEnemyY = y + (h / 2);
  //var centerX = x + (this.width / 2);
  //var centerY = y + (this.height / 2);
  //this.x = x - (centerX - centerEnemyX);
  //this.y = y - (centerY - centerEnemyY);

  var anim = this.animations.add('main', null, 30, false);
  this.animations.play('main');
  anim.onComplete.add(this.die, this);

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
