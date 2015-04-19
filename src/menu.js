'use strict';

var Menu = {
  create: function() {
    this.scrolling = true;
    this.startTime = game.time.time;
    game.stage.backgroundColor = '#000';
    game.world.setBounds(0, 0, 1442, 480);
    console.log('menu', this.startTime);

    this.currentOption = 'start';
    this.background = game.add.image(0, 0, 'landscape');
    this.bgmSound = game.add.audio('bgmintro', 1, true);
    this.selectSound = game.add.audio('select');

    this.tween = game.add.tween(game.camera);
    this.tween.to({x: 802}, 20000, Phaser.Easing.Linear.None, true, 700);
    this.tween.onComplete.add(function() {
      this.show();
    }, this);

    var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    enterKey.onDown.add(this.start, this);

    game.sound.stopAll();
    this.bgmSound.play();
  },

  start: function() {
    if (this.scrolling) {
      this.tween.stop();
      game.camera.x = 802;
      this.show();
    } else {
      this.selectSound.play();
      game.input.keyboard.stop();
      game.state.start('intro');
    }
  },

  show: function() {
    this.scrolling = false;
    bitmapTextCentered(game.height - 70, 'titles', 'Press ENTER to start', 12);
    bitmapTextCentered(game.height - 20, 'titles', 'Created by LudusPactum - @luduspactum', 10);
  }
};

