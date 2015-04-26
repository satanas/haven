'use strict';

var Ending = function() {};

Ending.prototype = {
  create: function() {
    game.stage.backgroundColor = '#000';
    bitmapTextCentered(100, 'press_start', "That's all folks!", 30);
    bitmapTextCentered(200, 'press_start', 'Thanks for playing this small demo', 16);
    bitmapTextCentered(220, 'press_start', 'We really appreciate your feedback', 16);
    bitmapTextCentered(240, 'press_start', 'in Twitter (luduspactum)', 16);
    bitmapTextCentered(320, 'press_start', 'Graphics: Alexander Hass', 12);
    bitmapTextCentered(340, 'press_start', 'Sounds: Juan Guzman', 12);
    bitmapTextCentered(360, 'press_start', 'Programming: Wil Alvarez', 12);
    bitmapTextCentered(440, 'press_start', 'Press Enter to restart', 16);

    game.sound.stopAll();
    this.bgmSound = game.add.audio('bgm-credits');

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
    game.state.start('menu');
  },
};
