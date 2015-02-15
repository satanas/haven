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
    this.load.tilemap('mario2', 'mario2.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.tilemap('boss', 'boss.json', null, Phaser.Tilemap.TILED_JSON);

    this.game.load.bitmapFont('arcade', 'assets/fonts/font.png', 'assets/fonts/font.fnt');
    this.game.load.bitmapFont('titles', 'assets/fonts/titles.png', 'assets/fonts/titles.fnt');
    this.game.load.bitmapFont('pixel_art', 'assets/fonts/pixel_art.png', 'assets/fonts/pixel_art.fnt');
    this.game.load.bitmapFont('press_start', 'assets/fonts/press_start.png', 'assets/fonts/press_start.fnt');

    this.load.image('wall', 'assets/box-blue.png');
    this.load.image('mario', 'assets/mario.png');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('enemy-bullet', 'assets/enemy-bullet.png');
    this.load.image('bg', 'assets/background.png');
    this.load.image('menu', 'assets/menu.jpg');
    this.load.image('diamond', 'assets/diamond.png');
    this.load.image('extralife', 'assets/extra-life.png');
    this.load.image('spikes', 'assets/spikes.png');
    this.load.image('blood', 'assets/blood-red.png');
    this.load.image('acid', 'assets/blood-acid.png');
    this.load.image('oil', 'assets/blood-oil.png');
    this.load.image('pieces', 'assets/blood-pieces.png');
    this.load.image('moving-platform', 'assets/moving-platform.png');
    this.load.image('box-blue', 'assets/box-blue.png');
    this.load.image('box-green', 'assets/box-green.png');
    this.load.image('alysa-face', 'assets/alysa-face.png');
    this.load.image('hud', 'assets/hud.png');
    this.load.image('timer', 'assets/timer.png');
    this.load.image('rock', 'assets/rock.png');
    this.load.image('gunner', 'assets/gunner.png');

    // These should be spritesheets
    this.load.image('acerbus', 'assets/acerbus.png');
    this.load.image('wave', 'assets/wave.png');

    this.load.spritesheet('shadow', 'assets/shadow.png', 60, 84);
    this.load.spritesheet('gumbon', 'assets/gumbon.png', 47, 37);
    this.load.spritesheet('gumbon-zombie', 'assets/gumbon-zombie.png', 47, 37);
    this.load.spritesheet('snailbot', 'assets/snailbot.png', 84, 67);
    this.load.spritesheet('ambusher', 'assets/ambusher.png', 93, 68);
    this.load.spritesheet('ladybug', 'assets/ladybug.png', 47, 36);
    this.load.spritesheet('wasp', 'assets/wasp.png', 82, 85);
    this.load.spritesheet('porktaicho', 'assets/porktaicho.png', 63, 51);
    this.load.spritesheet('alysa', 'assets/alysa.png', 38, 52);
    this.load.spritesheet('checkpoint', 'assets/checkpoint.png', 32, 64);
    this.load.spritesheet('lava', 'assets/lava.png', 32, 32);
    this.load.spritesheet('medusa', 'assets/meduzzo.png', 57, 46);
    this.load.spritesheet('skeleton', 'assets/skeleton.png', 23, 46);
    this.load.spritesheet('chandelkier', 'assets/chandelkier.png', 64, 32);
    this.load.spritesheet('boom', 'assets/boom.png', 73, 75);
    this.load.spritesheet('degradation', 'assets/alysa-degradation.png', 46, 37);
    this.load.spritesheet('planttrap', 'assets/planttrap.png', 96, 32);
    this.load.spritesheet('cuirass', 'assets/cuirass.png', 32, 32);
    this.load.spritesheet('carniplant', 'assets/carniplant.png', 56, 56);
    this.load.spritesheet('heart', 'assets/heart.png', 16, 16);
    this.load.spritesheet('cannon', 'assets/cannon.png', 83, 41);

    this.load.audio('alysajump', 'assets/sounds/alysajump.mp3');
    this.load.audio('alysadjump', 'assets/sounds/alysajumpairborne.mp3');
    this.load.audio('alysashoot', 'assets/sounds/alysashoot.mp3');
    this.load.audio('enemyshoot', 'assets/sounds/enemyshoot.mp3');
    this.load.audio('alysahurt', 'assets/sounds/alysahurtdamage.mp3');
    this.load.audio('alysadies', 'assets/sounds/alysadiestime.mp3');
    this.load.audio('diamond1', 'assets/sounds/diamondcollect.mp3');
    this.load.audio('diamond2', 'assets/sounds/diamondcollect2.mp3');
    this.load.audio('explosion', 'assets/sounds/explosion.wav');
    this.load.audio('medusahit', 'assets/sounds/medusahit.mp3');
    this.load.audio('select', 'assets/sounds/select.mp3');
    this.load.audio('extralife', 'assets/sounds/1up.wav');
    this.load.audio('lifedown', 'assets/sounds/1down.wav');
    this.load.audio('invulnerablehit', 'assets/sounds/invulnerablehit.mp3');
    this.load.audio('organichit', 'assets/sounds/organichit.mp3');
    this.load.audio('mechanichit', 'assets/sounds/mechanichit.mp3');

    // BGM
    this.load.audio('bgmintro', 'assets/sounds/bgm01intro.mp3');
    this.load.audio('gameover', 'assets/sounds/gameover.mp3');
    this.load.audio('ingame', 'assets/sounds/ingame1.mp3');
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
