'use strict';

var Gumbon = function(game, x, y, facing) {
  Phaser.Sprite.call(this, game, x, y, 'gumbon', 0);

  this.facing = facing;
  this.x1 = x - 100;
  this.x2 = x + 100;
  this.speed = 120;
  this.health = 5;
  this.hurt = false;
  this.harm = 1;
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

Gumbon.prototype.adjustHitBox = function() {
};

Gumbon.prototype.update = function() {
  this.game.physics.arcade.collide(this, groups.tiles);

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
    var blood = new BloodParticles(this.game, this.x, this.y);
    this.tint = 0xcd0937;
    this.hurt = true;
    this.hurtTime = game.time.time;
    this.health -= 1;
    if (this.health <= 0) {
      this.destroy();
    }
  }
};

var Snailbot = function(game, x, y, facing) {
  Phaser.Sprite.call(this, game, x, y, 'snailbot', 0);

  this.facing = facing;
  this.x1 = x - 100;
  this.x2 = x + 100;
  this.speed = 100;
  this.health = 5;
  this.harm = 1;
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
  this.game.physics.arcade.collide(this, groups.tiles);

  if (this.hurt) {
    if (this.game.time.elapsedSecondsSince(this.hurtTime) >= this.invincibilityTime) {
      this.hurt = false;
      this.alpha = 1;
      //this.tint = 0xffffff;
    }
  }

  this.render();

  if (!this.body.onFloor()) return;

  this.move();
};

Snailbot.prototype.move = AI.simpleMove;

Snailbot.prototype.adjustHitBox = function() {
};

Snailbot.prototype.render = function() {
  this.animations.play(this.facing);
};

Snailbot.prototype.takeDamage = function() {
  if (!this.hurt) {
    this.alpha = 0.5;
    //this.tint = 0xcd0937;
    this.hurt = true;
    this.hurtTime = game.time.time;
    this.health -= 1;
    if (this.health <= 0) {
      this.destroy();
    }
  }
};

var Porktaicho = function(game, player, x, y, facing, action) {
  Phaser.Sprite.call(this, game, x, y, 'porktaicho', 0);

  this.player = player;
  this.facing = facing;
  this.x1 = x - 100;
  this.x2 = x + 100;
  this.speed = 130;
  this.health = 5;
  this.harm = 1;
  this.hurt = false;
  this.hurtTime = 0;
  this.shooting = false;
  this.lastShotTime = 0;
  this.shotDelay = 1.5;
  this.action = action;
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

Porktaicho.prototype.adjustHitBox = function() {
  if (this.facing === 'left') {
    this.body.setSize(30, 51, 27, 0);
  } else {
    this.body.setSize(30, 51, 6, 0);
  }
};

Porktaicho.prototype.update = function() {
  this.game.physics.arcade.collide(this, groups.tiles);

  if (this.hurt) {
    if (this.game.time.elapsedSecondsSince(this.hurtTime) >= this.invincibilityTime) {
      this.hurt = false;
      this.tint = 0xffffff;
    }
  }

  this.render();

  if (!this.body.onFloor()) return;

  if (this.action === 'move') {
    this.move();
  } else if (this.action === 'stand') {
    this.turn();
  }
  this.shoot();
};

Porktaicho.prototype.move = AI.simpleMove;

Porktaicho.prototype.turn = function() {
  if (this.player.x - this.x <= 0) {
    this.facing = 'left';
  } else {
    this.facing = 'right';
  }
};

Porktaicho.prototype.shoot = function() {
  var playerIsNear = Math.abs(this.player.x - this.x) <= 500;
  if (this.shooting) {
    if (this.game.time.elapsedSecondsSince(this.lastShotTime) >= this.shotDelay) {
      this.shooting = false;
    }
  } else if (playerIsNear) {
    this.shooting = true;
    this.lastShotTime = this.game.time.time;
    var bullet = new EnemyBullet(this.game, this.body.x + (this.body.width / 2), this.body.y + 17, this.facing);
  }
};

Porktaicho.prototype.render = function() {
  if (this.action === 'stand') {
    if (this.facing === 'left') {
      this.frame = 0;
    } else {
      this.frame = 15;
    }
  } else {
    this.animations.play(this.facing);
  }
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

var SuperFlowah = function(game, player, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'superflowah', 0);

  this.player = player;
  this.health = 5;
  this.hurt = false;
  this.shotDelay = 0.7;
  this.maxShots = 3;
  this.shots = 0;
  this.harm = 1;
  this.hiddenDelay = 1.5;
  this.waitingDelay = 1.1;
  this.status = 'hidden';
  this.hurtTime = 0;
  this.shooting = false;
  this.lastActionTime = this.game.time.time;
  this.invincibilityTime = 0.100;
  this.animations.add('rise', [7, 8, 9, 10, 11, 12, 13], 12, false);
  this.animations.add('fall',  [14, 15, 16, 17, 18, 19, 20], 12, false);
  this.animations.add('shoot',  [0, 1, 2, 3, 4, 5], 12, true);

  this.game.physics.arcade.enableBody(this);
  this.body.gravity.y = 1000;
  this.body.setSize(60, 62, 35, 6);
  this.frame = 7;
  groups.enemies.add(this);
};

SuperFlowah.prototype = Object.create(Phaser.Sprite.prototype);
SuperFlowah.prototype.constructor = SuperFlowah;

SuperFlowah.prototype.update = function() {
  var playerIsNear = Math.abs(this.player.x - this.x) <= 500;

  this.game.physics.arcade.collide(this, groups.tiles);

  if (this.hurt) {
    if (this.game.time.elapsedSecondsSince(this.hurtTime) >= this.invincibilityTime) {
      this.hurt = false;
      this.tint = 0xffffff;
    }
  }

  this.render();

  if (!this.body.onFloor()) return;

  if (this.status === 'hidden') {
    if (this.game.time.elapsedSecondsSince(this.lastActionTime) >= this.hiddenDelay) {
      this.shots = 0;
      this.status = 'prepare';
      this.body.setSize(60, 62, 35, 6);
      this.animations.play('rise');
      this.lastActionTime = this.game.time.time;
    }
  } else if (this.status === 'prepare') {
    if (this.game.time.elapsedSecondsSince(this.lastActionTime) >= this.waitingDelay) {
      this.status = 'shooting';
      this.lastActionTime = this.game.time.time;
    }
  } else if (this.status === 'shooting') {
    if (playerIsNear) {
      if (this.game.time.elapsedSecondsSince(this.lastActionTime) >= this.shotDelay) {
        this.shots += 1;
        var bullet = new EnemyBullet(this.game, this.body.x - 20, this.body.y + 45, 'left');
        this.lastActionTime = this.game.time.time;
        this.animations.play('shoot');
        if (this.shots > 2) {
          this.animations.stop();
          this.frame = 14;
          this.status = 'done';
          this.lastActionTime = this.game.time.time;
        }
      }
    }
  } else if (this.status === 'done') {
    if (this.game.time.elapsedSecondsSince(this.lastActionTime) >= this.waitingDelay) {
      this.status = 'hidden';
      this.body.setSize(30, 35, 50, 34);
      this.animations.play('fall');
      this.lastActionTime = this.game.time.time;
    }
  }
};


SuperFlowah.prototype.render = function() {
};

SuperFlowah.prototype.takeDamage = function() {
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

var Ladybug = function(game, x, y, facing) {
  Phaser.Sprite.call(this, game, x, y, 'ladybug', 0);

  this.facing = facing;
  this.x1 = x - 100;
  this.x2 = x + 100;
  this.speed = 180;
  this.health = 5;
  this.harm = 1;
  this.hurt = false;
  this.hurtTime = 0;
  this.invincibilityTime = 0.100;
  this.animations.add('left', [0, 1, 2, 3, 4, 5], 12, true);
  this.animations.add('right',  [6, 7, 8, 9, 10, 11], 12, true);

  this.game.physics.arcade.enableBody(this);
  this.body.gravity.y = 1000;
  this.body.setSize(47, 30, 0, 6);
  this.animations.play('left');
  groups.enemies.add(this);
};

Ladybug.prototype = Object.create(Phaser.Sprite.prototype);
Ladybug.prototype.constructor = Ladybug;

Ladybug.prototype.adjustHitBox = function() {
};

Ladybug.prototype.update = function() {
  this.game.physics.arcade.collide(this, groups.tiles);

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

Ladybug.prototype.move = AI.simpleMove;

Ladybug.prototype.render = function() {
  this.animations.play(this.facing);
};

Ladybug.prototype.takeDamage = function() {
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

var Medusa = function(game, x, y, facing, xrange, yrange) {
  Phaser.Sprite.call(this, game, x, y, 'medusa', 0);

  this.origY = y;
  this.facing = facing;
  this.speed = 120;
  this.minX = this.x - xrange;
  this.maxX = this.x + xrange;
  this.maxCycles = 4;
  this.cycles = 0;
  this.yrange = 40;
  this.health = 5;
  this.harm = 1;
  this.hurt = false;
  this.hurtTime = 0;
  this.maxTime = 1000;
  this.elapsedTime = 0;
  this.invincibilityTime = 0.100;
  //this.animations.add('left', [0, 1, 2, 3, 4, 5], 12, true);
  //this.animations.add('right',  [6, 7, 8, 9, 10, 11], 12, true);

  this.game.physics.arcade.enableBody(this);
  this.body.allowGravity = false;
  //this.animations.play('left');
  groups.enemies.add(this);
};

Medusa.prototype = Object.create(Phaser.Sprite.prototype);
Medusa.prototype.constructor = Medusa;

Medusa.prototype.adjustHitBox = function() {
};

Medusa.prototype.update = function() {
  //this.game.physics.arcade.collide(this, groups.tiles);

  if (this.hurt) {
    if (this.game.time.elapsedSecondsSince(this.hurtTime) >= this.invincibilityTime) {
      this.hurt = false;
      this.tint = 0xffffff;
    }
  }

  //this.render();

  this.move();
};

Medusa.prototype.move = function() {
  if (this.facing === 'left') {
    this.body.velocity.x = -1 * this.speed;
    if (this.x <= this.minX) {
      this.facing = 'right';
    }
  } else {
    this.body.velocity.x = this.speed;
    if (this.x >= this.maxX) {
      this.facing = 'left';
    }
  }
  this.elapsedTime += this.game.time.elapsed;
  if (this.elapsedTime >= this.maxTime) {
    this.elapsedTime = 0;
  }
  var deltaY = this.yrange * Math.sin(this.elapsedTime * (2 * Math.PI) / this.maxTime);
  this.y = this.origY + deltaY;
};

Medusa.prototype.render = function() {
  //this.animations.play(this.facing);
};

Medusa.prototype.takeDamage = function() {
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
