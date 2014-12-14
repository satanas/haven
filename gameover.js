'use strict';

function GameOver() {}

GameOver.prototype = {
  create: function() {
    this.startTime = this.game.time.time;
    console.log('game over', this.startTime);
    this.game.input.keyboard.clearCaptures();
    this.game.input.keyboard.start();
    this.game.stage.backgroundColor = '#000';
    var label = game.add.text(200, 200, "Game Over", {fill: 'white'});
    var subLabel = game.add.text(170, 300, "Press Enter to restart", {fill: 'white'});
  },

  update: function() {
    if (this.game.time.time < this.startTime + this.game.global.sceneDelay) return;

    if (this.game.input.keyboard.justReleased(Phaser.Keyboard.ENTER)) {
      this.game.state.start('menu');
    }
  }
};
