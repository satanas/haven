'use strict';

var AudioPool = function(game, keys) {
  this.game = game;
  this.keys = keys;
  this.sounds = []

  for(var i=0; i<this.keys.length; i++) {
    this.sounds.push(this.game.add.audio(this.keys[i]));
  }
};

AudioPool.prototype.randomPlay = function() {
  var index = Math.floor(Math.random() * this.keys.length);
  this.sounds[index].play();
};
