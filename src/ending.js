'use strict';

var Ending = function() {};

Ending.prototype = {
  create: function() {
    this.startTime = this.game.time.time;
    console.log('demo ending', this.startTime);
    this.game.input.keyboard.clearCaptures();
    this.game.input.keyboard.start();
    this.game.stage.backgroundColor = '#000';
    bitmapTextCentered(this.game, 100, 'press_start', "That's all folks!", 30);
    bitmapTextCentered(this.game, 200, 'press_start', 'Thanks for playing this small demo', 16);
    bitmapTextCentered(this.game, 220, 'press_start', 'We really appreciate your feedback', 16);
    bitmapTextCentered(this.game, 240, 'press_start', 'in Twitter (luduspactum)', 16);
    bitmapTextCentered(this.game, 320, 'press_start', 'Graphics: Alexander Hass', 12);
    bitmapTextCentered(this.game, 340, 'press_start', 'Sounds: Juan Guzman', 12);
    bitmapTextCentered(this.game, 360, 'press_start', 'Programming: Wil Alvarez', 12);
    bitmapTextCentered(this.game, 440, 'press_start', 'Press Enter to restart', 16);

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
