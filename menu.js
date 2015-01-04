'use strict';

function Menu() {}

Menu.prototype = {
  create: function() {
    this.delay = 200;
    this.startTime = this.game.time.time;
    console.log('menu', this.startTime);
    this.game.input.keyboard.clearCaptures();
    this.game.stage.backgroundColor = '#000';
    this.currentOption = 'start';
    this.background = this.game.add.sprite(0, 0, 'menu');
  },

  update: function() {
    if (this.game.time.time < this.startTime + this.delay) return;

    if (this.game.input.keyboard.justReleased(Phaser.Keyboard.ENTER)) {
      this.game.input.keyboard.stop();
      this.game.state.start('intro');
    }
  }
};

