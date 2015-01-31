'use strict';

function Menu() {}

Menu.prototype = {
  create: function() {
    this.startTime = this.game.time.time;
    console.log('menu', this.startTime);
    this.game.input.keyboard.clearCaptures();
    this.game.stage.backgroundColor = '#000';
    this.currentOption = 'start';
    this.background = this.game.add.sprite(0, 0, 'menu');
    this.bgmSound = this.game.add.audio('bgmintro', 1, true);
    this.bgmSound.onDecoded.add(this.start, this);
  },

  start: function() {
    this.bgmSound.play();
  },

  update: function() {
    if (this.game.time.time < this.startTime + this.game.global.sceneDelay) return;

    if (this.game.input.keyboard.justReleased(Phaser.Keyboard.ENTER)) {
      this.game.input.keyboard.stop();
      this.game.state.start('intro');
    }
  }
};

