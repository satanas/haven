'use strict';

var Gumbon = function(game, x, y, direction) {
  Phaser.Sprite.call(this, game, x, y, 'gumbon', 0);

  this.facing = 'left';
  this.x1 = x - 100;
  this.x2 = x + 100;
  this.speed = 120;
  this.health = 3;
  this.hurt = false;
  this.hurtTime = 0;
  this.invincibilityTime = 0.100;
  this.animations.add('left', [0, 1, 2, 3, 4, 5], 12, true);
  this.animations.add('right',  [6, 7, 8, 9, 10, 11], 12, true);

  this.game.physics.arcade.enableBody(this);
  this.body.gravity.y = 1000;
  this.body.setSize(41, 35, 3, 1);
  this.animations.play('left');
  groups.enemies.add(this);
};

Gumbon.prototype = Object.create(Phaser.Sprite.prototype);
Gumbon.prototype.constructor = Gumbon;

Gumbon.prototype.update = function() {
  this.game.physics.arcade.collide(this, groups.platforms);

  if (this.hurt) {
    if (this.game.time.elapsedSecondsSince(this.hurtTime) >= this.invincibilityTime) {
      this.hurt = false;
      this.tint = 0xffffff;
    }
  }

  if (!this.body.onFloor()) return;

  if (this.facing === 'left') {
    this.body.velocity.x = -this.speed;
    if (this.x <= this.x1) {
      this.facing = 'right';
      this.animations.play('right');
      this.body.velocity.x = this.speed;
    }
  } else if (this.facing === 'right') {
    this.body.velocity.x = this.speed;
    if (this.x >= this.x2) {
      this.facing = 'left';
      this.animations.play('left');
      this.body.velocity.x = -this.speed;
    }
  }
};

Gumbon.prototype.takeDamage = function() {
  if (!this.hurt) {
    this.tint = 0xcd0937;
    this.hurt = true;
    this.hurtTime = game.time.time;
    this.health -= 1;
    if (this.health <= 0) {
      this.kill();
    }
  }
};
