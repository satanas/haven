'use strict';

var Gumbon = function(game, x, y, direction) {
  Phaser.Sprite.call(this, game, x, y, 'gumbon', 0);

  this.facing = 'left';
  this.x1 = x - 100;
  this.x2 = x + 100;
  this.speed = 120;
  this.health = 100;
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

  this.render();

  if (!this.body.onFloor()) return;

  this.move();
};

Gumbon.prototype.move = AI.simpleMove;

Gumbon.prototype.render = function() {
  this.animations.play(this.facing);
};

Gumbon.prototype.takeDamage = function() {
  if (!this.hurt) {
    this.tint = 0xcd0937;
    this.hurt = true;
    this.hurtTime = game.time.time;
    this.health -= 1;
    if (this.health <= 0) {
      this.destroy();
    }
  }
};

var Snailbot = function(game, x, y, direction) {
  Phaser.Sprite.call(this, game, x, y, 'snailbot', 0);

  this.facing = 'left';
  this.x1 = x - 100;
  this.x2 = x + 100;
  this.speed = 100;
  this.health = 100;
  this.hurt = false;
  this.hurtTime = 0;
  this.invincibilityTime = 0.100;
  this.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7], 12, true);
  this.animations.add('right',  [8, 9, 10, 11, 12, 13, 14], 12, true);

  this.game.physics.arcade.enableBody(this);
  this.body.gravity.y = 1000;
  //this.body.setSize(75, 50, 9, 14);
  this.body.setSize(79, 50, 5, 14);
  this.animations.play('left');
  groups.enemies.add(this);
};

Snailbot.prototype = Object.create(Phaser.Sprite.prototype);
Snailbot.prototype.constructor = Snailbot;

Snailbot.prototype.update = function() {
  this.game.physics.arcade.collide(this, groups.platforms);

  if (this.hurt) {
    if (this.game.time.elapsedSecondsSince(this.hurtTime) >= this.invincibilityTime) {
      this.hurt = false;
      this.tint = 0xffffff;
    }
  }

  this.render();

  if (!this.body.onFloor()) return;

  this.move();
};

Snailbot.prototype.move = AI.simpleMove;

Snailbot.prototype.render = function() {
  this.animations.play(this.facing);
};

Snailbot.prototype.takeDamage = function() {
  if (!this.hurt) {
    this.tint = 0xcd0937;
    this.hurt = true;
    this.hurtTime = game.time.time;
    this.health -= 1;
    if (this.health <= 0) {
      this.destroy();
    }
  }
};

var Porktaicho = function(game, player, x, y, direction) {
  Phaser.Sprite.call(this, game, x, y, 'porktaicho', 0);

  this.player = player;
  this.facing = 'left';
  this.x1 = x - 100;
  this.x2 = x + 100;
  this.speed = 100;
  this.health = 100;
  this.hurt = false;
  this.hurtTime = 0;
  this.shooting = false;
  this.lastShotTime = 0;
  this.shotDelay = 1.5;
  this.invincibilityTime = 0.100;
  this.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7], 16, true);
  this.animations.add('right',  [8, 9, 10, 11, 12, 13, 14], 16, true);

  this.game.physics.arcade.enableBody(this);
  this.body.gravity.y = 1000;
  this.body.setSize(30, 51, 26, 0);
  this.animations.play('left');
  groups.enemies.add(this);
};

Porktaicho.prototype = Object.create(Phaser.Sprite.prototype);
Porktaicho.prototype.constructor = Porktaicho;

Porktaicho.prototype.update = function() {
  this.game.physics.arcade.collide(this, groups.platforms);

  if (this.hurt) {
    if (this.game.time.elapsedSecondsSince(this.hurtTime) >= this.invincibilityTime) {
      this.hurt = false;
      this.tint = 0xffffff;
    }
  }

  this.render();

  if (!this.body.onFloor()) return;

  this.move();
  this.shoot();
  if (this.facing === 'left') {
    this.body.setSize(30, 51, 27, 0);
  } else {
    this.body.setSize(30, 51, 6, 0);
  }
  console.log(this.facing, this.body.offset.x);
};

Porktaicho.prototype.move = AI.simpleMove;

Porktaicho.prototype.shoot = function() {
  if (this.shooting) {
    if (this.game.time.elapsedSecondsSince(this.lastShotTime) >= this.shotDelay) {
      this.shooting = false;
    }
  } else {
    this.shooting = true;
    this.lastShotTime = this.game.time.time;
    var bullet = new EnemyBullet(this.game, this.body.x + (this.body.width / 2), this.body.y + 17, this.facing);
  }
};

Porktaicho.prototype.render = function() {
  this.animations.play(this.facing);
};

Porktaicho.prototype.takeDamage = function() {
  if (!this.hurt) {
    this.tint = 0xcd0937;
    this.hurt = true;
    this.hurtTime = game.time.time;
    this.health -= 1;
    if (this.health <= 0) {
      this.destroy();
    }
  }
};
