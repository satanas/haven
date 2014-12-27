'use strict';

var BloodParticles = function(game, x, y) {
  var emitter = game.add.emitter(x, y, 15);
  emitter.makeParticles('blood');
  emitter.gravity = 500;
  emitter.start(true, 2000, null, 5);
};

