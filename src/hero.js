'use strict';

var Alysa = function(x, y) {
  Phaser.Sprite.call(this, game, x, y, 'alysa', 0);

  this.health = game.global.maxHeroHealth;
  this.death = false;
  this.jumping = false;
  this.facing = 'right';
  this.canShoot = true;
  this.canDoubleJump = false;
  this.doubleJumping = false;
  this.lastShotTime = 0;
  this.hurt = false;
  this.hurtTime = 0;
  this.hurtDelay = 400;
  this.shooting = false;
  this.invincible = false;
  this.invincibilityDelay = 1000;
  this.status = 'alive'; // dying, dead
  this.deadTime = 0;
  this.dyingDelay = 900;
  this.shotDelay = 155;
  this.cursors = game.input.keyboard.createCursorKeys();

  //this.animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7], 12, true);
  //this.animations.add('left', [8, 9, 10, 11, 12, 13, 14, 15], 12, true);
  //this.animations.add('dying-left', [20, 21, 22, 23], 12, false);
  //this.animations.add('dying-right', [24, 25, 26, 27], 12, false);

  this.animations.add('idle-right', [0, 1, 2, 3, 4, 5], 12, true);
  this.animations.add('idle-left', [31, 30, 29, 28, 27, 26], 12, true);
  this.animations.add('right', [8, 9, 10, 11, 12, 13, 14, 15], 12, true);
  this.animations.add('left', [32, 33, 34, 35, 36, 37, 38, 39], 12, true);
  this.animations.add('dying-right', [17, 18, 19, 20, 21, 22], 12, false);
  this.animations.add('dying-left', [46, 45, 44, 43, 42, 41], 12, false);

  // Sounds
  this.jumpSound = game.add.audio('alysajump');
  this.doubleJumpSound = game.add.audio('alysadjump');
  this.shootSound = game.add.audio('alysashoot');
  this.hurtSound = game.add.audio('alysahurt');
  this.dieSound = game.add.audio('alysadies');
  this.extralifeSound = game.add.audio('extralife');
  this.diamondsSoundPool = new AudioPool(['diamond1', 'diamond2']);

  game.physics.arcade.enable(this);
  this.body.gravity.y = 1000;
  this.body.maxVelocity.y = 500;
  this.body.maxVelocity.x = 200;
  this.body.setSize(22, 45, 8, 7);
  game.camera.follow(this);
  game.add.existing(this);
};

Alysa.prototype = Object.create(Phaser.Sprite.prototype);
Alysa.prototype.constructor = Alysa;

Alysa.prototype.update = function() {
  game.physics.arcade.collide(this, groups.tiles, this.onCollision);
  game.physics.arcade.collide(this, groups.blockEnemies, this.onCollision);
  game.physics.arcade.collide(this, groups.platforms, this.onCollision, this.checkPlatform);
  game.physics.arcade.overlap(this, groups.checkpoints, this.onCheckpoint);

  if (this.status === 'alive') {
    game.physics.arcade.overlap(this, groups.enemies, this.takeDamage);
    game.physics.arcade.overlap(this, groups.items, this.pickItem);

    if (this.hurt) {
      this.canDoubleJump = false;
      if (game.time.elapsedSince(this.hurtTime) >= this.hurtDelay) {
        this.hurt = false;
        this.body.velocity.x = 0;
      }
    }

    if (this.invincible) {
      if (game.time.elapsedSince(this.hurtTime) >= this.invincibilityDelay) {
        this.invincible = false;
      }
      if (game.time.elapsedSince(this.hurtTime) >= this.invincibilityDelay - 120) {
        this.alpha = 1.0;
      }
    }

    this.movement();
    this.shoot();
    this.worldBoundCollisions();
  } else {
    this.body.velocity.x = 0;
    if (game.time.elapsedSince(this.deadTime) >= this.dyingDelay && !this.death) {
      this.death = true;
    }
  }

  this.render();
};

Alysa.prototype.onCheckpoint = function(self, checkpoint) {
  if (!checkpoint.activated) {
    checkpoint.activate();
    game.global.lastCheckpoint = checkpoint;
  }
};

Alysa.prototype.checkPlatform = function(self, platform) {
  return platform.canCollide();
};

Alysa.prototype.onCollision = function(self, block) {
  if (self.body.touching.down === true) {
    self.body.blocked.down = true;
  }
};

Alysa.prototype.movement = function() {
  if (!this.hurt) {
    if (this.cursors.left.isDown) {
      this.facing = 'left';
      this.body.velocity.x = -200;
    } else if (this.cursors.right.isDown) {
      this.facing = 'right';
      this.body.velocity.x = 200;
    } else {
      this.body.velocity.x = 0;
    }
  }

  if (this.cursors.up.justPressed(50) && !this.jumping && !this.hurt) {
    this.jumping = true;
    this.body.velocity.y = -800;
    this.jumpSound.play();
  }
  // Free fall
  if (this.body.velocity.y !== 0 && !this.jumping && !this.body.onFloor()) {
    this.jumping = true;
    //this.canDoubleJump = true;
  }

  if (this.body.onFloor()) {
    this.jumping = false;
    this.doubleJumping = false;
    this.canDoubleJump = false;
  }

  if (this.cursors.up.justReleased(50) && this.jumping && !this.doubleJumping) {
    this.canDoubleJump = true;
  }

  if (this.cursors.up.isDown && this.jumping && this.canDoubleJump) {
    this.doubleJumping = true;
    this.canDoubleJump = false;
    this.body.velocity.y = -500;
    this.doubleJumpSound.play();
  }
};

Alysa.prototype.shoot = function() {
  if (game.input.keyboard.justPressed(Phaser.Keyboard.X) && !this.shooting && this.canShoot && !this.hurt) {
    this.canShoot = false;
    this.lastShotTime = game.time.time;
    this.shooting = true;
    var bullet = new Bullet(this.body.x + (this.body.width / 2), this.body.y + (this.body.height / 2), this.facing);
    this.shootSound.play();
  }

  if (game.input.keyboard.justReleased(Phaser.Keyboard.X) && !this.canShoot) {
    this.canShoot = true;
  }

  if (this.canShoot && this.shooting) {
    if (game.time.elapsedSince(this.lastShotTime) >= this.shotDelay) {
      this.shooting = false;
    }
  }
};

Alysa.prototype.render = function() {
  if (this.status !== 'alive') return;

  if (this.jumping === true) {
    if (this.facing == 'left') {
      this.frame = 25;
    } else {
      this.frame = 6;
    }
  } else if (this.body.velocity.x !== 0 && this.body.onFloor()) {
    if (this.facing == 'left') {
      this.animations.play('left');
    } else if (this.facing == 'right') {
      this.animations.play('right');
    }
  } else {
    if (this.facing == 'left') {
      this.animations.play('idle-left');
    } else {
      this.animations.play('idle-right');
    }
  }
};

Alysa.prototype.takeDamage = function(self, object) {
  if (self.status === 'alive') {
    if (self.invincible) return;

    var harm = object.harm || 1;
    //self.damage();
    self.health -= harm;
    if (self.health <= 0) {
      var reason = object.deadType || deadType.BLEEDING;
      self.die(reason);
    } else {
      self.body.velocity.x = 220 * (self.facing === 'left' ? 1 : -1)
      self.body.velocity.y = -220;
      self.alpha = 0.5;
      self.hurt = true;
      self.invincible = true;
      self.hurtTime = game.time.time;
      self.canDoubleJump = false;
    }
    self.hurtSound.play();
  }
  if (object.type !== undefined && object.type === 'bullet') {
    object.kill();
  }
};

Alysa.prototype.pickItem = function(self, object) {
  if (object.itemType === 'diamond') {
    game.global.diamonds += 1;
    self.diamondsSoundPool.randomPlay();
    if (object.fixed) {
      game.global.items.push(object);
    }
    if (game.global.diamonds % game.global.diamondsToLife) {
      // extra life effect in HUD
      self.gainLife();
    }
  } else if (object.itemType === 'extralife') {
    self.gainLife();
    game.global.items.push(object);
  } else if (object.itemType === 'heart') {
    self.heal();
  }
  object.destroy();
};

Alysa.prototype.die = function(reason) {
  this.alpha = 1.0;
  this.deadTime = game.time.time;
  this.status = 'dying';
  game.camera.follow(null);
  game.global.causeOfDeath = reason || deadType.BLEEDING;
  console.log('Dying for', game.global.causeOfDeath);
  this.dieSound.play();
  if (this.facing === 'left') {
    this.animations.play('dying-left');
  } else {
    this.animations.play('dying-right');
  }
};

Alysa.prototype.worldBoundCollisions = function() {
  if (this.x >= game.world.width - this.width) {
    this.x = game.world.width - this.width;
  }
  if (this.x <= 0) {
    this.x = 0;
  }
  if (this.y > game.world.height && (this.status === 'alive')) {
    this.dyingDelay = 0.2;
    this.die();
  }
};

Alysa.prototype.heal = function() {
  this.health += 1;
  if (this.health > game.global.maxHeroHealth) {
    this.health = game.global.maxHeroHealth;
  }
  // FIX ME: change sound
  this.extralifeSound.play();
};

Alysa.prototype.gainLife = function() {
  game.global.lives += 1;
  this.extralifeSound.play();
};
