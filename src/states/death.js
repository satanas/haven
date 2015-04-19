'use strict';

function Death() {}

Death.prototype = {
  create: function() {
    game.stage.backgroundColor = '#000';

    this.lifeSound = game.add.audio('lifedown');
    game.add.sprite(208, 192, 'alysa-face');
    game.add.bitmapText(310, 245, 'press_start', 'x', 32);
    this.lives = game.add.bitmapText(360, 205, 'press_start', game.global.lives.toString(), 76);
    this.changeDelay = 1000;
    this.finishDelay = 700;
    this.elapsedTime = 0;
    this.changed = false;
  },

  update: function() {
    this.elapsedTime += game.time.elapsed;
    if (this.changed) {
      if (this.elapsedTime >= this.finishDelay) {
        game.state.start('play');
      }
    } else {
      if (this.elapsedTime >= this.changeDelay) {
        this.lifeSound.play();
        this.changed = true;
        game.global.lives -= 1;
        this.elapsedTime = 0;
        this.lives.setText(game.global.lives.toString());
      }
    }

  }
};
