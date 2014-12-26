'use strict';

function Preload() {
  this.logo = null;
  this.progressbar = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.logo = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
    this.logo.anchor.setTo(0.5, 0.5);
    this.progressbar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 80, 'preloadbar');
    this.progressbar.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.progressbar);

    this.load.tilemap('map', 'mario.json', null, Phaser.Tilemap.TILED_JSON);

    this.load.image('wall', 'assets/box-blue.png');
    this.load.image('mario', 'assets/mario.png');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('bg', 'assets/background.png');
    this.load.image('menu', 'assets/menu.png');
    this.load.image('diamond', 'assets/diamond.png');
    this.load.image('extralife', 'assets/extra-life.png');
    this.load.image('spikes', 'assets/spikes.png');

    // These should be spritesheets
    this.load.image('acerbus', 'assets/acerbus.png');
    this.load.image('wave', 'assets/wave.png');

    this.load.spritesheet('shadow', 'assets/shadow.png', 60, 84);
    this.load.spritesheet('gumbon', 'assets/gumbon.png', 47, 37);
    this.load.spritesheet('snailbot', 'assets/snailbot.png', 84, 67);
    this.load.spritesheet('alysa', 'assets/alysa.png', 38, 52);
  },

  create: function() {
    this.progressbar.cropEnabled = true;
  },

  update: function() {
    if (this.ready) {
      this.game.state.start('menu');
    }
  },

  onLoadComplete: function() {
    this.ready = true;
  }
};
