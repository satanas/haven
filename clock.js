'use strict';

var Clock = function(time, game) {
  this.maxTime = time;
  this.time = time;
  this.ended = false;
  this.looping = null;
};

Clock.prototype.start = function() {
  this.looping = game.time.events.loop(1000, this.onLoop, this);
};

Clock.prototype.onLoop = function() {
  this.time -= 1;
  if (this.time <= 0) {
    this.ended = true;
  }
};

Clock.prototype.reset = function() {
  this.time = this.maxTime;
  this.ended = false;
  this.looping = null;
  this.start();
};
