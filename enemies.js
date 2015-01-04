'use strict';

// Parent class for all enemies
var Enemy = function(game, x, y, type, facing, health) {
  Phaser.Sprite.call(this, game, x, y, type, 0);

  this.facing = facing;
  this.harm = 1;
  this.health = health;
  this.bloodType = 'blood';

  // Hurt variables
  this.hurt = false;
  this.hurtTime = 0;
  this.invincibilityTime = 100;

  // Shooting variables
  this.shooting = false;
  this.shootingDelay = 1000;
  this.shootingLapse = 1000;
  this.elapsedTimeAfterShot = 0;

  this.game.physics.arcade.enableBody(this);
  this.body.gravity.y = 1000;
  groups.enemies.add(this);
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;
Enemy.prototype.isPlayerNear = AI.isPlayerNear;

Enemy.prototype.takeDamage = function() {
  if (!this.hurt) {
    if (this.bloodType) {
      var blood = new BloodParticles(this.game, this.x + (this.body.width / 2), this.y + (this.body.height / 2), this.bloodType);
    }
    this.alpha = 0.5;
    this.hurt = true;
    this.hurtTime = game.time.time;
    this.health -= 1;
    if (this.health <= 0) {
      this.game.global.killedEnemies += 1;
      this.destroy();
      console.log('killed enemies', this.game.global.killedEnemies);
    }
  }
};

Enemy.prototype.recover = function() {
  if (this.hurt) {
    if (this.game.time.elapsedSince(this.hurtTime) >= this.invincibilityTime) {
      this.hurt = false;
      this.alpha = 1.0;
    }
  }
};

Enemy.prototype.tileCollisions = function() {
  this.game.physics.arcade.collide(this, groups.tiles);
};

Enemy.prototype.render = function() {
  this.animations.play(this.facing);
};

Enemy.prototype.turn = function() {
  if (this.player.x - this.x <= 0) {
    this.facing = 'left';
  } else {
    this.facing = 'right';
  }
};

Enemy.prototype.calculateWalkingRange = function(x, range) {
  if (range === -1) {
    this.minX = this.maxX = -1;
  } else {
    this.minX = x - range;
    this.maxX = x + range;
  }
};

Enemy.prototype.calculateBulletCoords = function() {
  return {x: this.body.x, y: this.body.y};
};

Enemy.prototype.shoot = function(withAngle) {
  var withAngle = withAngle || false;
  this.elapsedTimeAfterShot += this.game.time.elapsed;

  if (this.shooting) {
    if (this.elapsedTimeAfterShot >= this.shootingLapse) {
      this.shooting = false;
      this.elapsedTimeAfterShot = 0;
    }
  } else {
    if (this.elapsedTimeAfterShot >= this.shootingDelay && this.isPlayerNear(500)) {
      this.shooting = true;
      this.elapsedTimeAfterShot = 0;
      var p = this.calculateBulletCoords();
      var bullet = new EnemyBullet(this.game, p.x, p.y, this.facing, withAngle);
      this.onShooting();
    }
  }
};

Enemy.prototype.onWalkingLimits = function() {
  if (this.minX !== undefined && this.maxX !== undefined && (this.minX >= 0 && this.maxX >= 0)) {
    return this.body.x <= this.minX || this.body.x >= this.maxX;
  } else {
    return false;
  }
};

Enemy.prototype.adjustHitBox = function() {};
Enemy.prototype.onShooting = function() {};


//////////////////


var Gumbon = function(game, x, y, facing, zombie, range) {
  if (zombie && zombie === 'true') {
    Enemy.call(this, game, x, y, 'gumbon-zombie', facing, 6);
    this.speed = 60;
  } else {
    Enemy.call(this, game, x, y, 'gumbon', facing, 3);
    this.speed = 120;
  }

  this.calculateWalkingRange(x, range);
  this.body.setSize(41, 35, 3, 1);

  this.animations.add('left', [0, 1, 2, 3, 4, 5], 12, true);
  this.animations.add('right',  [6, 7, 8, 9, 10, 11], 12, true);
};

Gumbon.prototype = Object.create(Enemy.prototype);
Gumbon.prototype.constructor = Gumbon;
Gumbon.prototype.move = AI.simpleMove;

Gumbon.prototype.update = function() {
  this.tileCollisions();
  this.recover();
  this.render();
  if (!this.body.onFloor()) return;
  this.move();
};


var Snailbot = function(game, x, y, facing, range) {
  Enemy.call(this, game, x, y, 'snailbot', facing, 8);

  this.bloodType = 'oil';
  this.calculateWalkingRange(x, range);
  this.speed = 100;
  this.body.setSize(79, 50, 5, 14);

  this.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7], 12, true);
  this.animations.add('right',  [8, 9, 10, 11, 12, 13, 14], 12, true);
};

Snailbot.prototype = Object.create(Enemy.prototype);
Snailbot.prototype.constructor = Snailbot;
Snailbot.prototype.move = AI.simpleMove;

Snailbot.prototype.update = function() {
  this.tileCollisions();
  this.recover();
  this.render();
  if (!this.body.onFloor()) return;
  this.move();
};


var Porktaicho = function(game, player, x, y, facing, action, range) {
  Enemy.call(this, game, x, y, 'porktaicho', facing, 3);

  this.player = player;
  this.calculateWalkingRange(x, range);
  this.speed = 130;
  this.shootingDelay = 1500;
  this.shootingLapse = 0;
  this.action = action;
  this.body.setSize(30, 51, 26, 0);

  this.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7], 16, true);
  this.animations.add('right',  [8, 9, 10, 11, 12, 13, 14], 16, true);
};

Porktaicho.prototype = Object.create(Enemy.prototype);
Porktaicho.prototype.constructor = Porktaicho;
Porktaicho.prototype.move = AI.simpleMove;

Porktaicho.prototype.adjustHitBox = function() {
  if (this.facing === 'left') {
    this.body.setSize(30, 51, 27, 0);
  } else {
    this.body.setSize(30, 51, 6, 0);
  }
};

Porktaicho.prototype.update = function() {
  this.tileCollisions();
  this.recover();
  this.render();

  if (!this.body.onFloor()) return;

  if (this.action === 'move') {
    this.move();
  } else if (this.action === 'stand') {
    this.turn();
  }
  this.shoot();
};

Porktaicho.prototype.calculateBulletCoords = function() {
  return {x: this.body.x + (this.body.width / 2), y: this.body.y + 17};
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


var SuperFlowah = function(game, player, x, y) {
  Enemy.call(this, game, x, y, 'superflowah', 'left', 1);

  this.player = player;
  this.bloodType = 'pieces';
  this.health = 5;
  this.shotDelay = 700;
  this.maxShots = 3;
  this.shots = 0;
  this.harm = 1;
  this.hiddenDelay = 1500;
  this.waitingDelay = 1100;
  this.status = 'hidden';
  this.shooting = false;
  this.lastActionTime = this.game.time.time;
  this.animations.add('rise', [7, 8, 9, 10, 11, 12, 13], 12, false);
  this.animations.add('fall',  [14, 15, 16, 17, 18, 19, 20], 12, false);
  this.animations.add('shoot',  [0, 1, 2, 3, 4, 5], 16, true);

  this.game.physics.arcade.enableBody(this);
  this.body.gravity.y = 1000;
  this.body.setSize(60, 62, 35, 6);
  this.frame = 7;
  groups.enemies.add(this);
};

SuperFlowah.prototype = Object.create(Enemy.prototype);
SuperFlowah.prototype.constructor = SuperFlowah;
SuperFlowah.prototype.isPlayerNear = AI.isPlayerNear;
SuperFlowah.prototype.render = function() {};

SuperFlowah.prototype.update = function() {
  this.game.physics.arcade.collide(this, groups.tiles);

  this.recover();
  this.render();

  if (!this.body.onFloor()) return;

  if (this.status === 'hidden') {
    if (this.game.time.elapsedSince(this.lastActionTime) >= this.hiddenDelay) {
      this.shots = 0;
      this.status = 'prepare';
      this.body.setSize(60, 62, 35, 6);
      this.animations.play('rise');
      this.lastActionTime = this.game.time.time;
    }
  } else if (this.status === 'prepare') {
    if (this.game.time.elapsedSince(this.lastActionTime) >= this.waitingDelay) {
      this.status = 'shooting';
      this.lastActionTime = this.game.time.time;
    }
  } else if (this.status === 'shooting') {
    if (this.isPlayerNear(500)) {
      if (this.game.time.elapsedSince(this.lastActionTime) >= this.shotDelay) {
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
    if (this.game.time.elapsedSince(this.lastActionTime) >= this.waitingDelay) {
      this.status = 'hidden';
      this.body.setSize(30, 35, 50, 34);
      this.animations.play('fall');
      this.lastActionTime = this.game.time.time;
    }
  }
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


var Ladybug = function(game, x, y, facing, range) {
  Enemy.call(this, game, x, y, 'ladybug', facing, 1);

  this.speed = 80;
  this.bloodType = 'oil';
  this.calculateWalkingRange(x, range);
  this.body.setSize(47, 30, 0, 6);

  this.animations.add('left', [0, 1, 2, 3, 4, 5], 12, true);
  this.animations.add('right',  [6, 7, 8, 9, 10, 11], 12, true);
};

Ladybug.prototype = Object.create(Enemy.prototype);
Ladybug.prototype.constructor = Ladybug;
Ladybug.prototype.move = AI.simpleMove;

Ladybug.prototype.update = function() {
  this.tileCollisions();
  this.recover();
  this.render();
  if (!this.body.onFloor()) return;
  this.move();
};


var Medusa = function(game, x, y, facing, xrange, yrange) {
  Enemy.call(this, game, x, y, 'medusa', facing, 3);

  this.origY = y;
  this.bloodType = 'acid';
  this.speed = 120;
  this.calculateWalkingRange(x, xrange);
  this.maxCycles = 4;
  this.cycles = 0;
  this.yrange = 40;
  this.maxTime = 1000;
  this.elapsedTime = 0;
  this.body.allowGravity = false;

  //this.animations.add('left', [0, 1, 2, 3, 4, 5], 12, true);
  //this.animations.add('right',  [6, 7, 8, 9, 10, 11], 12, true);
};

Medusa.prototype = Object.create(Enemy.prototype);
Medusa.prototype.constructor = Medusa;

Medusa.prototype.update = function() {
  this.recover();
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


var Cannon = function(game, player, x, y, facing) {
  Enemy.call(this, game, x, y, 'cannon', facing, 3);

  this.bloodType = 'pieces';
  this.player = player;
  this.shootingLapse = 0;
  this.shootingDelay = 1500;

  this.shotLeft = this.animations.add('left', [0, 1, 2], 13, false);
  this.shotLeft.onComplete.add(this.render);
  this.shotRight = this.animations.add('right',  [5, 6, 7], 13, false);
  this.shotRight.onComplete.add(this.render);
};

Cannon.prototype = Object.create(Enemy.prototype);
Cannon.prototype.constructor = Cannon;
Cannon.prototype.adjustHitBox = function() {};

Cannon.prototype.onShooting = function() {
  this.animations.play(this.facing);
};

Cannon.prototype.update = function() {
  this.tileCollisions();
  this.recover();
  this.turn();
  this.shoot();
};

Cannon.prototype.calculateBulletCoords = function() {
  return {x: this.body.x + (this.body.width / 2), y: this.body.y + 17};
};

Cannon.prototype.render = function(self) {
  self.animations.stop();
  if (self.facing === 'left') {
    self.frame = 3;
  } else {
    self.frame = 4;
  }
};


var Wasp = function(game, player, x, y, facing, range) {
  Enemy.call(this, game, x, y, 'wasp', facing, 3);

  this.player = player;
  this.bloodType = 'oil';
  this.speed = 160;
  this.shootingLapse = 800;
  this.shootingDelay = 2000;
  this.calculateWalkingRange(x, range);
  this.maxTime = 1000;
  this.body.allowGravity = false;

  this.animations.add('left', [1, 4], 6, true);
  this.animations.add('right',  [7, 10], 6, true);
  this.animations.add('shoot-left', [2, 3, 4], 16, false);
  this.animations.add('shoot-right', [9, 8, 7], 16, false);
};

Wasp.prototype = Object.create(Enemy.prototype);
Wasp.prototype.constructor = Wasp;

Wasp.prototype.update = function() {
  this.recover();
  this.render();
  this.move();
  this.shoot(true);
};

Wasp.prototype.move = function() {
  if (this.shooting) {
    this.body.velocity.x = 0;
  } else {
    if (this.isPlayerNear(90)) {
      this.body.velocity.x = 0;
      this.turn();
    } else {
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
    }
  }
};

Wasp.prototype.calculateBulletCoords = function() {
  return {x: this.body.x + 48, y: this.body.y + (this.facing === 'left' ? 48 : 54)};
};

Wasp.prototype.onShooting = function() {
  this.animations.play('shoot-' + this.facing);
};

Wasp.prototype.render = function() {
  if (!this.shooting) {
    this.animations.play(this.facing);
  }
};

var Skeleton = function(game, x, y, facing, zombie, range) {
  Enemy.call(this, game, x, y, 'skeleton', facing, 2);

  this.speed = 80;
  this.bloodType = null;
  this.calculateWalkingRange(x, range);
  this.body.setSize(41, 35, 3, 1);

  //this.animations.add('left', [0, 1, 2, 3, 4, 5], 12, true);
  //this.animations.add('right',  [6, 7, 8, 9, 10, 11], 12, true);
};

Skeleton.prototype = Object.create(Enemy.prototype);
Skeleton.prototype.constructor = Skeleton;
Skeleton.prototype.move = AI.simpleMove;

Skeleton.prototype.update = function() {
  this.tileCollisions();
  this.recover();
  //this.render();
  if (!this.body.onFloor()) return;
  this.move();
};
