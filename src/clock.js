'use strict';

var Clock = function(game) {
  this.maxTime = 0;
  this.criticalTime = 0;
  this.time = 0;
  this.game = game;
  this.ended = false;
  this.looping = null;
};

Clock.prototype.start = function(initTime, criticalTime) {
  this.maxTime = initTime * 1000;
  this.criticalTime = criticalTime * 1000;
  this.time = initTime * 1000;
};

Clock.prototype.update = function() {
  if (!this.ended) {
    this.time -= this.game.time.elapsed;
    if (this.time <= 0) {
      this.ended = true;
    }
  }
};

Clock.prototype.isCritical = function() {
  return this.time <= this.criticalTime;
};

Clock.prototype.getTime = function() {
  return parseInt(this.time / 1000);
};

Clock.prototype.reset = function() {
  this.time = this.maxTime;
  this.ended = false;
  //this.looping = null;
};
