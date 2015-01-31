'use strict';

function GameOver() {}

GameOver.prototype = {
  create: function() {
    this.startTime = this.game.time.time;
    console.log('game over', this.startTime);
    this.game.input.keyboard.clearCaptures();
    this.game.input.keyboard.start();
    this.game.stage.backgroundColor = '#000';
    bitmapTextCentered(this.game, 160, 'press_start', 'Game Over', 56); //72
    if (this.game.global.causeOfDeath === deadType.TIMEOUT) {
      bitmapTextCentered(this.game, 250, 'press_start', 'Acerbus escaped with the king', 22); //30
    } else {
      bitmapTextCentered(this.game, 250, 'press_start', 'You died', 22); //30
    }
    bitmapTextCentered(this.game, 440, 'press_start', 'Press Enter to restart', 16); //22

    this.game.sound.stopAll();
    this.bgmSound = this.game.add.audio('gameover');
    this.bgmSound.onDecoded.add(this.start, this);

    // Reset variables
    this.game.global.diamonds = 0;
    this.game.global.lives = 3;
    this.game.global.lastCheckpoint = null;
    this.game.global.causeOfDeath = null;
    this.game.global.items = [];
  },

  start: function() {
    this.bgmSound.play();
  },

  update: function() {
    if (this.game.time.time < this.startTime + this.game.global.sceneDelay) return;

    if (this.game.input.keyboard.justReleased(Phaser.Keyboard.ENTER)) {
      this.game.state.start('menu');
    }
  }
};
