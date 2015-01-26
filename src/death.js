'use strict';

function Death() {}

Death.prototype = {
  create: function() {
    this.startTime = this.game.time.time;
    this.game.input.keyboard.clearCaptures();
    this.game.input.keyboard.start();
    this.game.stage.backgroundColor = '#000';

    this.game.add.sprite(208, 192, 'alysa-face');
    this.game.add.bitmapText(304, 250, 'arcade', 'x', 32);
    this.lives = this.game.add.bitmapText(336, 197, 'arcade', this.game.global.lives.toString(), 96);
    this.changeDelay = 1000;
    this.finishDelay = 700;
    this.elapsedTime = 0;
    this.changed = false;
  },

  update: function() {
    if (this.game.time.time < this.startTime + this.game.global.sceneDelay) return;

    this.elapsedTime += this.game.time.elapsed;
    if (this.changed) {
      if (this.elapsedTime >= this.finishDelay) {
        this.game.state.start('game');
      }
    } else {
      if (this.elapsedTime >= this.changeDelay) {
        this.changed = true;
        this.game.global.lives -= 1;
        this.elapsedTime = 0;
        this.lives.setText(this.game.global.lives.toString());
      }
    }

  }
};
