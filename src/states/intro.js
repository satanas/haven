'use strict';

function Intro() {}

Intro.prototype = {
  create: function() {
    this.startTime = this.game.time.time;
    console.log('intro', this.startTime);
    this.game.input.keyboard.clearCaptures();
    this.game.input.keyboard.start();
    this.game.stage.backgroundColor = '#fff';
    var label = game.add.text(200, 200, "Here goes the intro.\n Press 'Enter' to continue", {fill: 'red'});
  },

  update: function() {
    if (this.game.time.time < this.startTime + this.game.global.sceneDelay) return;

    if (this.game.input.keyboard.justReleased(Phaser.Keyboard.ENTER)) {
      this.game.state.start('play');
    }
  }
};
