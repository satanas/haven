'use strict';

function Boot() {};

Boot.prototype = {
  preload: function() {
    this.game.stage.backgroundColor = '#fff';
    this.load.image('preloadbar', 'assets/preloadbar.png');
    this.load.image('logo', 'assets/luduspactum_logo.png');
  },

  create: function () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.state.start('preload');
  }
};
