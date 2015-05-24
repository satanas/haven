'use strict';

var Disclaimer = {
  create: function() {
    game.stage.backgroundColor = '#000';
    bitmapTextCentered(60, 'press_start', 'Demo disclaimer', 30);
    bitmapTextCentered(150, 'press_start', 'This release has the sole purpose of', 16);
    bitmapTextCentered(180, 'press_start', 'demonstrate the basis of the game', 16);
    bitmapTextCentered(210, 'press_start', 'mechanic. Some parts of the story', 16);
    bitmapTextCentered(240, 'press_start', 'were removed to avoid spoilers', 16);
    bitmapTextCentered(440, 'press_start', 'Press Enter to continue', 12);

    game.sound.stopAll();
    this.selectSound = game.add.audio('select');

    var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    enterKey.onDown.addOnce(this.start, this);
  },

  start: function() {
    this.selectSound.play();
    game.state.start('intro');
  }
};
