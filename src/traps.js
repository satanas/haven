'use strict';

var Trap = function(game, x, y, sprite) {
  Phaser.Sprite.call(this, game, x, y, sprite, 0);

  this.game.physics.arcade.enable(this);
  this.body.allowGravity = false;
  this.harm = 999;
  groups.enemies.add(this);
};

Trap.prototype = Object.create(Phaser.Sprite.prototype);
Trap.prototype.constructor = Trap;
Trap.prototype.isVulnerable = function(object) {
  return false;
};

var Spike = function(game, x, y) {
  Trap.call(this, game, x, y, 'spikes');

  this.body.setSize(32, 24, 0, 8);
};

Spike.prototype = Object.create(Phaser.Sprite.prototype);
Spike.prototype.constructor = Spike;
Spike.prototype.isVulnerable = function(object) {
  return false;
};

var Lava = function(game, x, y) {
  Trap.call(this, game, x, y, 'lava');

  this.deadType = deadType.BURNING;
  this.body.setSize(32, 20, 0, 12);
  this.animations.add('main', [0, 1], 2, true);
  this.animations.play('main');
};

Lava.prototype = Object.create(Phaser.Sprite.prototype);
Lava.prototype.constructor = Lava;

var BearTrap = function(game, player, x, y) {
  Trap.call(this, game, x, y, 'box-blue');

  this.deadType = deadType.DECAPITATION;
  this.player = player;
  this.body.setSize(32, 10, 0, 22);
  this.activated = false;
};

BearTrap.prototype = Object.create(Trap.prototype);
BearTrap.prototype.constructor = BearTrap;

BearTrap.prototype.update = function() {
  this.game.physics.arcade.collide(this, groups.tiles);
  this.game.physics.arcade.overlap(this, this.player, this.onActivation);
  if (this.activated) {
    this.tint = 0xcf00e2;
  }
};

BearTrap.prototype.onActivation = function(self, player) {
  player.x = self.x;
  this.activated = true;
};


var FallingTrap = function(game, player, x, y, sprite, mode, delay, animated) {
  console.log(x, y, sprite, mode, delay, animated);
  Trap.call(this, game, x, y, sprite);

  this.origY = y;
  this.deadType = deadType.BLEEDING;
  this.player = player;
  this.body.gravity.y = 1200;
  //this.body.setSize(32, 32, 0, 0);
  this.mode = mode;
  this.harm = 1;
  this.activationTime = 0;
  this.activationDelay = delay;
  this.activated = false;
  this.respawnTime = 0;
  this.respawnDelay = 500;
  this.animated = animated;

  if (this.animated) {
    this.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10, true);
  }
};

FallingTrap.prototype = Object.create(Trap.prototype);
FallingTrap.prototype.constructor = FallingTrap;
FallingTrap.prototype.isPlayerNear = AI.isPlayerNear;

FallingTrap.prototype.update = function() {
  this.game.physics.arcade.collide(this, groups.tiles, this.onCollision);

  if (this.alive) {
    if (!this.activated) {
      if (this.isPlayerNear(20)) {
        this.activated = true;
      }
    } else {
      this.activationTime += this.game.time.elapsed;
      if (this.activationTime >= this.activationDelay) {
        this.body.allowGravity = true;
      }
    }
    this.render();
  } else {
    this.respawnTime += this.game.time.elapsed;
    if (this.respawnTime >= this.respawnDelay) {
      if (this.mode === 'infinite') {
        this.reset();
      } else {
        this.destroy();
      }
    }
  }
};

FallingTrap.prototype.render = function() {
  if (this.animated) {
    if (this.activated) {
      this.frame = 2;
    } else {
      this.animations.play('idle');
    }
  }
};

FallingTrap.prototype.onCollision = function(self, object) {
  self.kill();
};

FallingTrap.prototype.reset = function() {
  this.revive();
  this.body.allowGravity = false;
  this.activated = false;
  this.activationTime = 0;
  this.respawnTime = 0;
  this.y = this.origY;
};

var StunningRock = function(game, x, y, yspeed, fallingdelay, idledelay) {
  Trap.call(this, game, x, y, 'box-blue');

  this.origY = y;
  this.fallingSpeed = yspeed;
  this.deadType = deadType.BLEEDING;
  this.body.setSize(32, 32, 0, 0);
  this.harm = 1;
  this.idleDelay = idledelay;
  this.elapsedTime = 0;
  this.fallingDelay = fallingdelay;
  this.mode = 'prepared'; // prepared, falling, idle, rising
};

StunningRock.prototype = Object.create(Trap.prototype);
StunningRock.prototype.constructor = StunningRock;

StunningRock.prototype.update = function() {
  this.game.physics.arcade.collide(this, groups.tiles, this.onCollision);

  if (this.mode === 'prepared') {
    this.elapsedTime += this.game.time.elapsed;
    if (this.elapsedTime >= this.fallingDelay) {
      this.elapsedTime = 0;
      this.mode = 'falling';
      this.body.velocity.y = this.fallingSpeed;
    }
  } else if (this.mode === 'idle'){
    this.elapsedTime += this.game.time.elapsed;
    if (this.elapsedTime >= this.idleDelay) {
      this.elapsedTime = 0;
      this.mode = 'rising';
      this.body.velocity.y = -150;
    }
  } else if (this.mode === 'rising'){
    if (this.y <= this.origY) {
      this.mode = 'prepared';
      this.elapsedTime = 0;
      this.body.velocity.y = 0;
      this.y = this.origY;
    }
  }
};

StunningRock.prototype.onCollision = function(self, object) {
  self.mode = 'idle';
};
