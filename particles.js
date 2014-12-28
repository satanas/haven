'use strict';

var BloodParticles = function(game, x, y) {
  this.game = game;
  this.emitter = this.game.add.emitter(x, y, 15);
  this.emitter.makeParticles('blood');
  this.emitter.gravity = 500;
  this.emitter.minParticleSpeed.setTo(-100, -200);
  this.emitter.maxParticleSpeed.setTo(50, 100);
  this.emitter.angularDrag = 10;
  this.emitter.start(true, 2000, null, 5);
  //this.game.physics.arcade.collide(this.emitter, groups.tiles);
};

