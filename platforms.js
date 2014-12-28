'use strict';

var MovingPlatform = function(game, player, x, y, movement, min, max) {
  Phaser.Sprite.call(this, game, x, y, 'moving-platform', 0);

  this.player = player;
  this.speed = 100;
  this.movement = movement;
  this.game.physics.arcade.enable(this);
  this.body.allowGravity = false;
  this.body.immovable = true;
  //this.body.setSize(64, 16, 0, 0);
  this.body.checkCollision.down = false;
  if (this.movement === 'vertical') {
    this.direction = 'up';
    this.min = this.y - (min || 100);
    this.max = this.y + (max || 100);
    this.body.velocity.y = this.speed;
  } else {
    this.direction = 'left';
    this.min = this.x - (min || 100);
    this.max = this.x + (max || 100);
    this.body.velocity.x = this.speed;
  }
  this.origX = this.x;
  this.origY = this.y;
  groups.platforms.add(this);
};

MovingPlatform.prototype = Object.create(Phaser.Sprite.prototype);
MovingPlatform.prototype.constructor = MovingPlatform;

MovingPlatform.prototype.update = function() {
  this.origX = this.x;
  this.origY = this.y;
};

MovingPlatform.prototype.preUpdate = function() {
  Phaser.Sprite.prototype.preUpdate.call(this);
  var playerOnTop = false;
  if (this.player.y + this.player.height === this.y && this.player.x < this.x + this.width && this.player.x >= this.x) {
    playerOnTop = true;
  }
  if (this.movement === 'vertical') {
    if (this.direction === 'up') {
      if (this.y > this.max) {
        this.y = this.max;
        this.body.velocity.y *= -1;
        this.direction = 'down';
      }
    } else {
      if (this.y < this.min) {
        this.y = this.min;
        this.direction = 'up';
        this.body.velocity.y *= -1;
      }
    }
  } else {
    if (this.direction === 'left') {
      this.body.velocity.x = -1 * this.speed;
    } else {
      this.body.velocity.x = this.speed;
    }
  }
  var deltaX = this.x - this.origX;
  var deltaY = this.y - this.origY;
  if (playerOnTop) {
    this.player.body.touching.down = true;
    this.player.body.blocked.down = true;
  }
};
