'use strict';

var Preload = {
  preload: function() {
    var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
    var progressbar = game.add.sprite(220, game.world.centerY + 80, 'preloadbar');
    logo.anchor.setTo(0.5, 0.5);
    progressbar.anchor.setTo(0, 0.5);

    game.load.setPreloadSprite(progressbar);

    game.load.tilemap('mario', 'maps/mario.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('mario2', 'maps/mario2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('boss', 'maps/boss.json', null, Phaser.Tilemap.TILED_JSON);

    game.load.bitmapFont('arcade', 'assets/fonts/font.png', 'assets/fonts/font.fnt');
    game.load.bitmapFont('titles', 'assets/fonts/titles.png', 'assets/fonts/titles.fnt');
    game.load.bitmapFont('pixel_art', 'assets/fonts/pixel_art.png', 'assets/fonts/pixel_art.fnt');
    game.load.bitmapFont('press_start', 'assets/fonts/press-start.png', 'assets/fonts/press-start.fnt');

    game.load.image('wall', 'assets/box-blue.png');
    game.load.image('mario', 'assets/mario.png');
    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('enemy-bullet', 'assets/enemy-bullet.png');
    game.load.image('bg', 'assets/background.png');
    game.load.image('menu', 'assets/menu.jpg');
    game.load.image('landscape', 'assets/landscape.jpg');
    game.load.image('diamond', 'assets/diamond.png');
    game.load.image('diamond-hud', 'assets/diamond-hud.png');
    game.load.image('extralife', 'assets/extra-life.png');
    game.load.image('spikes', 'assets/spikes.png');
    game.load.image('blood', 'assets/blood-red.png');
    game.load.image('acid', 'assets/blood-acid.png');
    game.load.image('oil', 'assets/blood-oil.png');
    game.load.image('pieces', 'assets/blood-pieces.png');
    game.load.image('moving-platform', 'assets/moving-platform.png');
    game.load.image('box-blue', 'assets/box-blue.png');
    game.load.image('box-green', 'assets/box-green.png');
    game.load.image('alysa-face', 'assets/alysa-face.png');
    game.load.image('clock', 'assets/clock.png');
    game.load.image('rock', 'assets/rock.png');
    game.load.image('gunner', 'assets/gunner.png');
    game.load.image('acerbus-hud', 'assets/acerbus-hud.png');
    game.load.image('throne-room', 'assets/throne-room.jpg');
    game.load.image('menu-bg1', 'assets/menu-background-1.png');
    game.load.image('menu-bg2', 'assets/menu-background-2.png');
    game.load.image('menu-bg3', 'assets/menu-background-3.png');
    game.load.image('clouds', 'assets/clouds.png');
    game.load.image('castle', 'assets/castle.png');
    game.load.image('mountain', 'assets/mountain.png');
    game.load.image('chain', 'assets/chain.png');
    game.load.image('king-dialog', 'assets/dialog-king.png');
    game.load.image('alysa-dialog', 'assets/dialog-alysa.png');
    game.load.image('acerbus-dialog', 'assets/dialog-acerbus.png');
    game.load.image('shuriken', 'assets/shuriken.png');

    // These should be spritesheets
    game.load.image('wave', 'assets/wave.png');

    game.load.spritesheet('shadow', 'assets/shadow.png', 36, 59);
    game.load.spritesheet('gumbon', 'assets/gumbon.png', 47, 37);
    game.load.spritesheet('gumbon-zombie', 'assets/gumbon-zombie.png', 47, 37);
    game.load.spritesheet('snailbot', 'assets/snailbot.png', 84, 67);
    game.load.spritesheet('ambusher', 'assets/ambusher.png', 93, 68);
    game.load.spritesheet('ladybug', 'assets/ladybug.png', 47, 36);
    game.load.spritesheet('wasp', 'assets/wasp.png', 82, 85);
    game.load.spritesheet('porktaicho', 'assets/porktaicho.png', 63, 51);
    game.load.spritesheet('alysa', 'assets/alysa.png', 38, 52);
    game.load.spritesheet('checkpoint', 'assets/checkpoint.png', 32, 64);
    game.load.spritesheet('lava', 'assets/lava.png', 32, 32);
    game.load.spritesheet('medusa', 'assets/meduzzo.png', 57, 46);
    game.load.spritesheet('skeleton', 'assets/skeleton.png', 23, 46);
    game.load.spritesheet('chandelkier', 'assets/chandelkier.png', 64, 32);
    game.load.spritesheet('boom', 'assets/boom.png', 73, 75);
    game.load.spritesheet('alysa-hud', 'assets/alysa-hud.png', 46, 37);
    game.load.spritesheet('planttrap', 'assets/planttrap.png', 96, 32);
    game.load.spritesheet('cuirass', 'assets/cuirass.png', 32, 32);
    game.load.spritesheet('carniplant', 'assets/carniplant.png', 56, 56);
    game.load.spritesheet('heart', 'assets/heart.png', 16, 16);
    game.load.spritesheet('cannon', 'assets/cannon.png', 83, 41);
    game.load.spritesheet('portal', 'assets/portal.png', 128, 128);
    game.load.spritesheet('acerbus', 'assets/acerbus.png', 36, 59);
    game.load.spritesheet('king', 'assets/king.png', 53, 68);
    game.load.spritesheet('energy-chain', 'assets/energy-chain.png', 34, 12);
    game.load.spritesheet('smoke', 'assets/smoke.png', 69, 60);

    game.load.audio('alysadjump', 'assets/sounds/alysajump.mp3');
    game.load.audio('alysajump', 'assets/sounds/alysajumpairborne.mp3');
    game.load.audio('alysashoot', 'assets/sounds/alysashoot.mp3');
    game.load.audio('enemyshoot', 'assets/sounds/enemyshoot.mp3');
    game.load.audio('alysahurt', 'assets/sounds/alysahurtdamage.mp3');
    game.load.audio('alysadies', 'assets/sounds/alysadiestime.mp3');
    game.load.audio('diamond1', 'assets/sounds/diamondcollect.mp3');
    game.load.audio('diamond2', 'assets/sounds/diamondcollect2.mp3');
    game.load.audio('explosion', 'assets/sounds/explosion.wav');
    game.load.audio('medusahit', 'assets/sounds/medusahit.mp3');
    game.load.audio('select', 'assets/sounds/select.mp3');
    game.load.audio('extralife', 'assets/sounds/1up.wav');
    game.load.audio('lifedown', 'assets/sounds/1down.wav');
    game.load.audio('invulnerablehit', 'assets/sounds/invulnerablehit.mp3');
    game.load.audio('organichit', 'assets/sounds/organichit.mp3');
    game.load.audio('mechanichit', 'assets/sounds/mechanichit.mp3');

    // BGM
    game.load.audio('bgm-menu', 'assets/sounds/bgm-menu.mp3');
    game.load.audio('bgm-gameover', 'assets/sounds/bgm-gameover.mp3');
    game.load.audio('bgm-ingame', 'assets/sounds/bgm-ingame.mp3');
    game.load.audio('bgm-boss', 'assets/sounds/bgm-boss.mp3');
    game.load.audio('bgm-credits', 'assets/sounds/bgm-credits.mp3');
    game.load.audio('bgm-intro', 'assets/sounds/bgm-intro.mp3');
  },

  create: function() {
    game.state.start('menu');
  },
};
