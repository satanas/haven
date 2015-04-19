'use strict';

var Boot = {
  preload: function() {
    game.stage.backgroundColor = '#fff';
    game.load.image('preloadbar', 'assets/preloadbar.png');
    game.load.image('logo', 'assets/luduspactum_logo.png');
  },

  create: function () {
    game.plugin = game.plugins.add(Phaser.Plugin.Fade)
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.state.start('preload');
  }
};
