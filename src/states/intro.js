'use strict';

function Intro() {}

Intro.prototype = {
  create: function() {
    game.stage.backgroundColor = '#fff';
    var label = game.add.text(200, 200, "Here goes the intro.\n Press 'Enter' to continue", {fill: 'red'});

    var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    enterKey.onDown.addOnce(this.start, this);
  },

  start: function() {
    game.state.start('play');
  }
};
