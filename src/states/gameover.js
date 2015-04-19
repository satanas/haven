'use strict';

var GameOver = {
  create: function() {
    game.stage.backgroundColor = '#000';
    bitmapTextCentered(160, 'press_start', 'Game Over', 56); //72
    if (game.global.causeOfDeath === deadType.TIMEOUT) {
      bitmapTextCentered(250, 'press_start', 'Acerbus escaped with the king', 22); //30
    } else {
      bitmapTextCentered(250, 'press_start', 'You died', 22); //30
    }
    bitmapTextCentered(440, 'press_start', 'Press Enter to restart', 16); //22

    game.sound.stopAll();
    this.bgmSound = game.add.audio('gameover');
    this.selectSound = game.add.audio('select');

    var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    enterKey.onDown.addOnce(this.start, this);

    // Reset variables
    game.global.diamonds = 0;
    game.global.lives = 3;
    game.global.lastCheckpoint = null;
    game.global.causeOfDeath = null;
    game.global.items = [];

    this.bgmSound.play();
  },

  start: function() {
    this.selectSound.play();
    game.state.start('menu');
  },
};
