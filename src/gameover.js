'use strict';

var GameOver = function() {};

GameOver.prototype = {
  create: function() {
    this.startTime = game.time.time;
    console.log('game over', this.startTime);
    game.input.keyboard.clearCaptures();
    game.input.keyboard.start();
    game.stage.backgroundColor = '#000';
    bitmapTextCentered(160, 'press_start', 'Game Over', 56); //72
    if (this.game.global.causeOfDeath === deadType.TIMEOUT) {
      bitmapTextCentered(250, 'press_start', 'Acerbus escaped with the king', 22); //30
    } else {
      bitmapTextCentered(250, 'press_start', 'You died', 22); //30
    }
    bitmapTextCentered(440, 'press_start', 'Press Enter to restart', 16); //22

    game.sound.stopAll();
    this.bgmSound = game.add.audio('gameover');
    this.bgmSound.onDecoded.add(this.start, this);
    this.selectSound = game.add.audio('select');

    // Reset variables
    game.global.diamonds = 0;
    game.global.lives = 3;
    game.global.lastCheckpoint = null;
    game.global.causeOfDeath = null;
    game.global.items = [];
  },

  start: function() {
    this.bgmSound.play();
  },

  update: function() {
    if (game.time.time < this.startTime + game.global.sceneDelay) return;

    if (game.input.keyboard.justReleased(Phaser.Keyboard.ENTER)) {
      this.selectSound.play();
      game.state.start('menu');
    }
  }
};
