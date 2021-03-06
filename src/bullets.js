'use strict';

var Bullet = function(x, y, direction) {
  Phaser.Sprite.call(this, game, x, y, 'bullet', 0);

  this.speed = 600;
  this.facing = direction;
  game.physics.arcade.enable(this);
  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;
  this.body.allowGravity = false;
  this.body.sensor = true;
  this.bringToTop();
  if (direction === 'left') {
    this.body.velocity.x = -1 * this.speed;
  } else {
    this.body.velocity.x = this.speed;
  }
  groups.bullets.add(this);
};

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function() {
  game.physics.arcade.collide(this, groups.tiles, this.die);
  game.physics.arcade.collide(this, groups.blockEnemies, this.makeDamage);
  game.physics.arcade.overlap(this, groups.enemies, this.makeDamage);
  if (!this.alive) {
    this.destroy();
  }
};

Bullet.prototype.die = function(self, platform) {
  self.kill();
};

Bullet.prototype.makeDamage = function(self, object) {
  if (object && object.isVulnerable && object.isVulnerable(self)) {
    if (object.takeDamage) {
      object.takeDamage();
    }
  } else {
    if (object.rejectDamage) {
      object.rejectDamage();
    }
  }
  self.kill();
};

var EnemyBullet = function(x, y, angle) {
  Phaser.Sprite.call(this, game, x, y, 'enemy-bullet', 0);

  this.speed = 600;
  game.physics.arcade.enable(this);
  this.body.allowGravity = false;
  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;
  this.body.sensor = true;
  this.bringToTop();
  var radAngle = Math.PI / 180 * angle;
  this.body.velocity.x = Math.cos(radAngle) * this.speed;
  this.body.velocity.y = Math.sin(radAngle) * this.speed;
  this.shootSound = game.add.audio('enemyshoot');

  this.shootSound.play();
  groups.enemies.add(this);
};

EnemyBullet.prototype = Object.create(Phaser.Sprite.prototype);
EnemyBullet.prototype.constructor = EnemyBullet;

EnemyBullet.prototype.update = function() {
  game.physics.arcade.overlap(this, groups.tiles, this.die);
  if (!this.alive) {
    this.destroy();
  }
};

EnemyBullet.prototype.die = function(self, platform) {
  self.kill();
};

EnemyBullet.prototype.takeDamage = function() {};
