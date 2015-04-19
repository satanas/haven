'use strict';

// Parent class for all enemies
var Enemy = function(game, x, y, type, facing, health, group) {
  Phaser.Sprite.call(this, game, x, y, type, 0);

  this.facing = facing;
  this.harm = 1;
  this.health = health;
  this.bloodType = bloodType.BLOOD;
  this.willDrop = true;

  // Hurt variables
  this.hurt = false;
  this.hurtTime = 0;
  this.invincible = false;
  this.invincibilityTime = 100;

  // Shooting variables
  this.shooting = false;
  this.shootingDelay = 1000;
  this.shootingLapse = 1000;
  this.elapsedTimeAfterShot = 0;

  this.game.physics.arcade.enableBody(this);
  this.body.gravity.y = 1000;
  this.hitSound = null;
  if (group === undefined) {
    groups.enemies.add(this);
  } else {
    group.add(this);
  }
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;
Enemy.prototype.isPlayerNear = AI.isPlayerNear;

Enemy.prototype.takeDamage = function() {
  if (!this.hurt && !this.invincible) {
    if (this.bloodType) {
      var blood = new BloodParticles(this.game, this.x + (this.body.width / 2), this.y + (this.body.height / 2), this.bloodType);
    }
    this.alpha = 0.5;
    this.hurt = true;
    this.hurtTime = this.game.time.time;
    this.health -= 1;
    if (this.hitSound !== null) {
      this.hitSound.play();
    }
    if (this.health <= 0) {
      var exp = new Explosion(this.game, this.x, this.y, this.width, this.height);
      this.game.global.killedEnemies += 1;
      console.log('killed enemies', this.game.global.killedEnemies);
      this.drop();
      this.destroy();
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

Enemy.prototype.shoot = function(angle) {
  if (angle === undefined){
    angle = this.facing === 'left' ? 180 : 0;
  }

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
      var bullet = new EnemyBullet(p.x, p.y, angle);
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

Enemy.prototype.isVulnerable = function(object) {
  return !this.invincible;
};

Enemy.prototype.drop = function() {
  if (!this.willDrop) return;

  var value = Math.floor(Math.random() * 10) / 10;
  if (value <= game.global.drop) {
    var x = this.x + (this.width / 2),
        y = this.y + (this.height / 2);
    if (Math.round(Math.random()) === 0) {
      var diamond = new Diamond(x, y);
    } else {
      var heart = new Heart(x, y);
    }
  }
};

Enemy.prototype.adjustHitBox = function() {};
Enemy.prototype.onShooting = function() {};
Enemy.prototype.rejectDamage = function() {};


//////////////////


var Gumbon = function(game, x, y, facing, zombie, range, map) {
  if (zombie === 'true') {
    Enemy.call(this, game, x, y, 'gumbon-zombie', facing, 6);
    this.speed = 60;
  } else {
    Enemy.call(this, game, x, y, 'gumbon', facing, 3);
    this.speed = 120;
  }

  this.map = map;
  this.calculateWalkingRange(x, range);
  this.body.setSize(41, 35, 3, 1);
  this.hitSound = this.game.add.audio('organichit');

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


var Snailbot = function(game, x, y, facing, range, map) {
  Enemy.call(this, game, x, y, 'snailbot', facing, 8);

  this.map = map;
  this.bloodType = bloodType.OIL;
  this.calculateWalkingRange(x, range);
  this.speed = 100;
  this.body.setSize(79, 50, 5, 14);

  this.hitSound = this.game.add.audio('mechanichit');
  this.invulnerableSound = this.game.add.audio('invulnerablehit');
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

Snailbot.prototype.isVulnerable = function(object) {
  if (object.facing === this.facing) {
    return false;
  } else {
    var y1 = this.y + 32;
    var y2 = this.y + 62;
    console.log(y1, '<=', object.body.y, '<=', y2, object.facing);
    if (object.y >= y1 && object.y <= y2) {
      return true;
    }
  }
  return true;
};

Snailbot.prototype.rejectDamage = function() {
  this.invulnerableSound.play();
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
  this.hitSound = this.game.add.audio('organichit');

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


var Ambusher = function(game, player, x, y, facing, moveable) {
  Enemy.call(this, game, x, y, 'ambusher', facing, 3);

  this.player = player;
  this.bloodType = bloodType.PIECES;
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

Ambusher.prototype = Object.create(Enemy.prototype);
Ambusher.prototype.constructor = Ambusher;
Ambusher.prototype.isPlayerNear = AI.isPlayerNear;
Ambusher.prototype.render = function() {};

Ambusher.prototype.update = function() {
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
        var angle = this.facing === 'left' ? 180 : 0;
        var bullet = new EnemyBullet(this.body.x - 20, this.body.y + 45, angle);
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

var Ladybug = function(game, x, y, facing, range) {
  Enemy.call(this, game, x, y, 'ladybug', facing, 1);

  this.speed = 80;
  this.bloodType = bloodType.OIL;
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
  this.bloodType = bloodType.ACID;
  this.speed = 120;
  this.calculateWalkingRange(x, xrange);
  this.maxCycles = 4;
  this.cycles = 0;
  this.yrange = 40;
  this.maxTime = 1000;
  this.elapsedTime = 0;
  this.body.allowGravity = false;

  this.animations.add('left', [0, 1, 2, 3], 12, true);
  this.animations.add('right',  [4, 5, 6, 7], 12, true);
  this.hitSound = this.game.add.sound('organichit');
};

Medusa.prototype = Object.create(Enemy.prototype);
Medusa.prototype.constructor = Medusa;

Medusa.prototype.update = function() {
  this.recover();
  this.render();
  this.move();
};

Medusa.prototype.move = function() {
  if (this.facing === 'left') {
    this.body.velocity.x = -1 * this.speed;
    if ((this.x <= this.minX) || (this.x <= 0)){
      this.facing = 'right';
    }
  } else {
    this.body.velocity.x = this.speed;
    if ((this.x >= this.maxX) || (this.x + this.width >= this.game.world.width)) {
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


var Cuirass = function(game, player, x, y, facing) {
  Enemy.call(this, game, x, y, 'cuirass', facing, 1);

  this.bloodType = bloodType.PIECES;
  this.player = player;
  this.shootingLapse = 0;
  this.shootingDelay = 500;
  this.angles = (this.facing === 'left') ? [210, 180, 150] : [-45, 0, 45];
  this.index = 0;
  this.hiddenLapse = 2500;
  this.hiddenTime = 0;
  this.hidden = true;
  this.body.allowGravity = false;

  this.invulnerableSound = this.game.add.audio('invulnerablehit');

  if (facing === 'left') {
    this.animations.add('open', [0, 1, 2], 10, false);
    this.animations.add('close', [2, 2, 2, 1, 0], 10, false);
    this.frame = 0;
  } else {
    this.animations.add('open', [5, 4, 3], 10, false);
    this.animations.add('close', [3, 3, 3, 4, 5], 10, false);
    this.frame = 5;
  }
};

Cuirass.prototype = Object.create(Enemy.prototype);
Cuirass.prototype.constructor = Cuirass;
Cuirass.prototype.adjustHitBox = function() {};

Cuirass.prototype.onShooting = function() {
  this.index += 1;
  if (this.index > 2) {
    this.animations.play('close');
    this.hidden = true;
    this.index = 0;
  }
};

Cuirass.prototype.update = function() {
  this.tileCollisions();
  this.recover();
  this.turn();

  if (this.hidden) {
    this.hiddenTime += this.game.time.elapsed;
    if (this.hiddenTime >= this.hiddenLapse) {
      this.hidden = false;
      this.hiddenTime = 0;
      this.animations.play('open');
    }
  } else {
    this.shoot(this.angles[this.index]);
  }
};

Cuirass.prototype.isVulnerable = function(object) {
  return !this.hidden;
};

Cuirass.prototype.rejectDamage = function() {
  this.invulnerableSound.play();
};

Cuirass.prototype.calculateBulletCoords = function() {
  var yOffset = (this.index === 0) ? 10 : ((this.index === 1) ? 13 : 17);
  return {x: this.body.x + (this.body.width / 2), y: this.body.y + yOffset};
};

Cuirass.prototype.render = function(self) {
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
  this.bloodType = bloodType.OIL;
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
  var angle = (this.facing === 'left') ? 135 : 45;
  this.shoot(angle);
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

  this.speed = 60;
  this.bloodType = null;
  this.calculateWalkingRange(x, range);

  this.animations.add('left', [0, 1, 2, 3, 4, 5], 9, true);
  this.animations.add('right',  [6, 7, 8, 9, 10, 11], 9, true);
};

Skeleton.prototype = Object.create(Enemy.prototype);
Skeleton.prototype.constructor = Skeleton;
Skeleton.prototype.move = AI.simpleMove;

Skeleton.prototype.update = function() {
  this.tileCollisions();
  this.recover();
  this.render();
  if (!this.body.onFloor()) return;
  this.move();
};

var Carniplant = function(game, x, y) {
  Enemy.call(this, game, x, y, 'carniplant', 'left', 2);

  this.body.allowGravity = false;
  this.bloodType = bloodType.BLOOD;

  this.animations.add('main', [0, 1], 9, true);
  this.animations.play('main');
};

Carniplant.prototype = Object.create(Enemy.prototype);
Carniplant.prototype.constructor = Carniplant;

Carniplant.prototype.update = function() {
  this.recover();
  this.render();
};

var Gunner = function(game, player, x, y) {
  Enemy.call(this, game, x, y, 'gunner', 'left', 1, groups.blockEnemies);

  this.player = player;
  this.shootingDelay = 1500;
  this.shootingLapse = 0;
  this.body.setSize(32, 20, 0, 12);
  this.body.immovable = true;
  this.invulnerableSound = this.game.add.audio('invulnerablehit');
  this.frame = 0;
};

Gunner.prototype = Object.create(Enemy.prototype);
Gunner.prototype.constructor = Gunner;

Gunner.prototype.update = function() {
  this.tileCollisions();
  this.render();
  this.turn();

  if (!this.body.onFloor()) return;

  this.shoot();
};

Gunner.prototype.isVulnerable = function(object) {
  return false;
};

Gunner.prototype.rejectDamage = function() {
  this.invulnerableSound.play();
};

Gunner.prototype.calculateBulletCoords = function() {
  var xOffset = (this.facing === 'left') ? -4 : 4
  return {x: this.body.x + (this.body.width / 2) + xOffset, y: this.body.y + 2};
};

var Cannon = function(game, player, x, y) {
  Enemy.call(this, game, x, y, 'cannon', 'left', 3, groups.enemies);

  this.player = player;
  this.bloodType = bloodType.OIL;
  this.shootingDelay = 1500;
  this.shootingLapse = 0;
  this.body.setSize(48, 40, 34, 0);
  this.body.immovable = true;
  this.frame = 0;
};

Cannon.prototype = Object.create(Enemy.prototype);
Cannon.prototype.constructor = Cannon;

Cannon.prototype.update = function() {
  this.tileCollisions();
  this.recover();
  this.render();

  if (!this.body.onFloor()) return;

  this.shoot();
};

Cannon.prototype.isVulnerable = function(object) {
  return true;
};

Cannon.prototype.calculateBulletCoords = function() {
  return {x: this.body.x + (this.body.width / 2) - 4, y: this.body.y + 15};
};
