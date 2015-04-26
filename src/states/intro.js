'use strict';

function Intro() {}

Intro.prototype = {
  create: function() {
    game.stage.backgroundColor = '#fff';
    this.background = game.add.image(0, 0, 'throne-room');

    var label = game.add.text(200, 300, "Here goes the intro.\n Press 'Enter' to continue", {fill: 'red'});
    this.bgmSound = game.add.audio('bgm-intro', 1, true);


    var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    enterKey.onDown.addOnce(this.start, this);

    game.sound.stopAll();
    this.bgmSound.play();
  },

  start: function() {
    game.state.start('play');
  }
};
