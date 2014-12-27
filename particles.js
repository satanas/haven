'use strict';

var BloodParticles = function(game, x, y) {
  var emitter = game.add.emitter(x, y, 15);
  emitter.makeParticles('blood');
  emitter.gravity = 500;
  emitter.minParticleSpeed.setTo(-100, -200);
  emitter.maxParticleSpeed.setTo(50, 100);
  emitter.angularDrag = 10;
  emitter.start(true, 2000, null, 5);
};

