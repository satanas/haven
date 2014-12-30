'use strict';

var Alysa = function(game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'alysa', 0);

  this.health = 10;
  this.jumping = false;
  this.facing = 'right';
  this.canShoot = true;
  this.canDoubleJump = false;
  this.doubleJumping = false;
  this.lastShotTime = 0;
  this.hurt = false;
  this.hurtTime = 0;
  this.hurtDelay = 0.400;
  this.shooting = false;
  this.invincible = false;
  this.invincibilityDelay = 1.000;
  this.status = 'alive'; // dying, dead
  this.deadTime = 0;
  this.dyingDelay = 0.9;
  this.reasonOfDeath = null;
  this.shotDelay = 0.155;
  this.cursors = this.game.input.keyboard.createCursorKeys();

  this.animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7], 12, true);
  this.animations.add('left', [8, 9, 10, 11, 12, 13, 14, 15], 12, true);
  this.animations.add('dying-left', [20, 21, 22, 23], 12, false);
  this.animations.add('dying-right', [24, 25, 26, 27], 12, false);

  this.game.physics.arcade.enable(this);
  this.body.gravity.y = 1000;
  this.body.maxVelocity.y = 500;
  this.body.maxVelocity.x = 200;
  this.body.setSize(22, 45, 8, 7);
  this.game.camera.follow(this);
  this.game.add.existing(this);
};

Alysa.prototype = Object.create(Phaser.Sprite.prototype);
Alysa.prototype.constructor = Alysa;

Alysa.prototype.update = function() {
  this.game.physics.arcade.collide(this, groups.tiles, this.onCollision);
  this.game.physics.arcade.collide(this, groups.platforms, this.onCollision);

  if (this.status === 'alive') {
    this.game.physics.arcade.overlap(this, groups.enemies, this.takeDamage);
    this.game.physics.arcade.overlap(this, groups.items, this.pickItem);

    if (this.hurt) {
      if (this.game.time.elapsedSecondsSince(this.hurtTime) >= this.hurtDelay) {
        this.hurt = false;
        this.body.velocity.x = 0;
      }
    }

    if (this.invincible) {
      if (this.game.time.elapsedSecondsSince(this.hurtTime) >= this.invincibilityDelay) {
        this.invincible = false;
        this.alpha = 1.0;
      }
    }

    this.movement();
    this.shoot();
    this.worldBoundCollisions();
  } else {
    this.body.velocity.x = 0;
    if (this.game.time.elapsedSecondsSince(this.deadTime) >= this.dyingDelay) {
      var self = this;
      this.game.plugin.fadeOut(0x000, 750, 0, function() {
        self.game.state.start('gameover');
      });
    }
  }

  this.render();
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
  }
  // Free fall
  if (this.body.velocity.y !== 0 && !this.jumping && !this.body.onFloor()) {
    this.jumping = true;
    this.canDoubleJump = true;
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
  }
};

Alysa.prototype.shoot = function() {
  if (this.game.input.keyboard.justPressed(Phaser.Keyboard.X) && !this.shooting && this.canShoot && !this.hurt) {
    this.canShoot = false;
    this.lastShotTime = game.time.time;
    this.shooting = true;
    var bullet = new Bullet(this.game, this.body.x + (this.body.width / 2), this.body.y + (this.body.height / 2), this.facing);
  }

  if (this.game.input.keyboard.justReleased(Phaser.Keyboard.X) && !this.canShoot) {
    this.canShoot = true;
  }

  if (this.canShoot && this.shooting) {
    if (this.game.time.elapsedSecondsSince(this.lastShotTime) >= this.shotDelay) {
      this.shooting = false;
    }
  }
};

Alysa.prototype.render = function() {
  if (this.status !== 'alive') return;

  if (this.jumping === true) {
    if (this.facing == 'left') {
      this.frame = 19;
    } else {
      this.frame = 18;
    }
  } else if (this.body.velocity.x !== 0 && this.body.onFloor()) {
    if (this.facing == 'left') {
      this.animations.play('left');
    } else if (this.facing == 'right') {
      this.animations.play('right');
    }
  } else {
    this.animations.stop();
    if (this.facing == 'left') {
      this.frame = 17;
    } else {
      this.frame = 16;
    }
  }
};

Alysa.prototype.takeDamage = function(self, object) {
  if (self.status === 'alive') {
    //self.die();
    if (self.invincible) return;

    var harm = object.harm || 1;
    //self.damage();
    self.health -= harm;
    console.log('mierda', self.health);
    if (self.health <= 0) {
      var reason = object.deadType || 'dead';
      self.die(reason);
    } else {
      self.body.velocity.x = 220 * (self.facing === 'left' ? 1 : -1)
      self.body.velocity.y = -220;
      self.alpha = 0.5;
      self.hurt = true;
      self.invincible = true;
      self.hurtTime = game.time.time;
    }
  }
  if (object.type !== undefined && object.type === 'bullet') {
    object.kill();
  }
};

Alysa.prototype.pickItem = function(self, object) {
  if (object.type === 'diamond') {
    self.game.global.diamonds += 1;
    console.log('picking diamonds', self.game.global.diamonds);
  } else if (object.type === 'extralife') {
    self.game.global.lives += 1;
    console.log('picking extralife', self.game.global.lives);
  }
  object.destroy();
};

Alysa.prototype.die = function(reason) {
  this.alpha = 1.0;
  this.deadTime = this.game.time.time;
  this.status = 'dying';
  this.game.camera.follow(null);
  reasonOfDeath = reason || 'dead';
  console.log('Dying for', reasonOfDeath);
  if (this.facing === 'left') {
    this.animations.play('dying-left');
  } else {
    this.animations.play('dying-right');
  }
};

Alysa.prototype.worldBoundCollisions = function() {
  if (this.x >= this.game.world.width - this.width) {
    this.x = this.game.world.width - this.width;
  }
  if (this.x <= 0) {
    this.x = 0;
  }
  if (this.y > this.game.world.height && (this.status === 'alive')) {
    this.dyingDelay = 0.2;
    this.die();
  }
};
