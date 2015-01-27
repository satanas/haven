'use strict';

var Clock = function(game) {
  this.maxTime = 0;
  this.time = 0;
  this.game = game;
  this.ended = false;
  this.looping = null;
};

Clock.prototype.start = function(time) {
  this.maxTime = time * 1000;
  this.time = time * 1000;
  //this.looping = game.time.events.loop(1000, this.onLoop, this);
};

Clock.prototype.update = function() {
  if (!this.ended) {
    this.time -= this.game.time.elapsed;
    if (this.time <= 0) {
      this.ended = true;
    }
  }
};

Clock.prototype.getTime = function() {
  return parseInt(this.time / 1000);
};

//Clock.prototype.onLoop = function() {
//  this.time -= 1;
//  if (this.time <= 0) {
//    this.ended = true;
//  }
//};

Clock.prototype.reset = function() {
  this.time = this.maxTime;
  this.ended = false;
  //this.looping = null;
};
