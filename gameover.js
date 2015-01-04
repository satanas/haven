'use strict';

function GameOver() {}

GameOver.prototype = {
  create: function() {
    this.startTime = this.game.time.time;
    console.log('game over', this.startTime);
    this.game.input.keyboard.clearCaptures();
    this.game.input.keyboard.start();
    this.game.stage.backgroundColor = '#000';
    var label = game.add.text(250, 200, "Game Over", {fill: 'white'});
    if (this.game.global.causeOfDeath === deadType.TIMEOUT) {
      var reason = game.add.text(150, 250, "Acerbus escaped with the king", {fill: 'white'});
    } else {
      var reason = game.add.text(250, 250, "You died", {fill: 'white'});
    }
    var subLabel = game.add.text(170, 450, "Press Enter to restart", {fill: 'white'});

    // Reset variables
    this.game.global.diamonds = 0;
    this.game.global.lives = 3;
    this.game.global.lastCheckpoint = null;
    this.game.global.causeOfDeath = null;
  },

  update: function() {
    if (this.game.time.time < this.startTime + this.game.global.sceneDelay) return;

    if (this.game.input.keyboard.justReleased(Phaser.Keyboard.ENTER)) {
      this.game.state.start('menu');
    }
  }
};
