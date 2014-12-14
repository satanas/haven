'use strict';

var Alysa = function(game, cursors, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'alysa', 0);

  this.cursors = cursors;
  this.jumping = false;
  this.facing = 'right';
  this.canShoot = true;
  this.canDoubleJump = false;
  this.doubleJumping = false;
  this.lastShotTime = 0;
  this.shooting = false;
  this.death = false;

  this.animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7], 12, true);
  this.animations.add('left',  [8, 9, 10, 11, 12, 13, 14, 15], 12, true);

  this.game.physics.arcade.enable(this);
  this.body.gravity.y = 1000;
  this.body.maxVelocity.y = 500;
  this.body.maxVelocity.x = 200;
  this.body.setSize(22, 45, 8, 7);
  this.game.camera.follow(this);
};

Alysa.prototype = Object.create(Phaser.Sprite.prototype);
Alysa.prototype.constructor = Alysa;

Alysa.prototype.update = function() {
  if (this.body.onFloor()) {
    this.jumping = false;
    this.doubleJumping = false;
    this.canDoubleJump = false;
  }

  if (this.cursors.left.isDown) {
    this.facing = 'left';
    this.body.velocity.x = -200;
  } else if (this.cursors.right.isDown) {
    this.facing = 'right';
    this.body.velocity.x = 200;
  } else {
    this.body.velocity.x = 0;
  }

  if (this.cursors.up.justPressed(50) && !this.jumping) {
    this.jumping = true;
    this.body.velocity.y = -800;
  }
  // Free fall
  if (this.body.velocity.y !== 0 && !this.jumping) {
    this.jumping = true;
    this.canDoubleJump = true;
  }

  if (this.cursors.up.justReleased(50) && this.jumping && !this.doubleJumping) {
    this.canDoubleJump = true;
  }

  if (this.cursors.up.isDown && this.jumping && this.canDoubleJump) {
    this.doubleJumping = true;
    this.canDoubleJump = false;
    this.body.velocity.y = -500;
  }

  if (this.game.input.keyboard.justPressed(Phaser.Keyboard.X) && !this.shooting && this.canShoot) {
    this.shooting = true;
    var bullet = this.bullets.create(this.body.x + (this.body.width / 2), this.body.y + (this.body.height / 2), 'bullet');
    bullet.body.allowGravity = false;
    bullet.bringToTop();
    if (this.facing === 'left') {
      bullet.body.velocity.x = -1 * this.game.global.maxBulletSpeed;
    } else {
      bullet.body.velocity.x = this.game.global.maxBulletSpeed;
    }
  }

  if (this.game.input.keyboard.justReleased(Phaser.Keyboard.X)) {
    this.shooting = false;
  }

  this.worldBoundCollisions();
  this.deathByFalling();
  this.render();
};

Alysa.prototype.render = function() {
  if (this.jumping === true) {
    if (this.facing == 'left') {
      this.frame = 19;
    } else {
      this.frame = 18;
    }
  } else if (this.body.velocity.x !== 0 && this.body.velocity.y === 0) {
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

Alysa.prototype.deathByFalling = function() {
  if (this.y > this.game.world.height && !this.death) {
    var self = this;
    this.death = true;
    this.game.plugin.fadeOut(0x000, 750, 0, function() {
      self.game.state.start('gameover');
    });
  }
};

Alysa.prototype.worldBoundCollisions = function() {
  if (this.x >= this.game.world.width - this.width) {
    this.x = this.game.world.width - this.width;
  }
  if (this.x <= 0) {
    this.x = 0;
  }
};
