'use strict';

function Game() {}

Game.prototype = {
  create: function() {
    this.map = null;
    this.player = null;
    this.boss = null;

    this.game.stage.backgroundColor = '#3498db';
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 300;

    this.bg1 = game.add.tileSprite(0, 0, 640, 480, 'bg');
    this.bg1.fixedToCamera = true;
    groups.bullets = this.game.add.group();
    groups.bullets.enableBody = true;

    groups.enemies = this.game.add.group();
    groups.enemies.enableBody = true;

    this.map = this.game.add.tilemap('map');
    this.map.addTilesetImage('MARIO', 'mario');
    groups.platforms = this.map.createLayer('Platforms');
    this.back_deco = this.map.createLayer('Back Decorations');
    this.front_deco = this.map.createLayer('Front Decorations');
    this.map.setCollisionBetween(1, 120, true, 'Platforms');
    groups.platforms.resizeWorld();
    //groups.platforms.debug = true;

    this.player = new Alysa(this.game, 250, 170);
    //this.gumbon = new Gumbon(this.game, 100, 100, 0);
    this.boss = new Acerbus(this.game, 544, 364);

    this.game.world.bringToTop(groups.bullets);
  },

  update: function() {
    if (this.player.death){
      console.log('death effect');
      this.player.body.enable = false;
      return;
    }
    this.bg1.tilePosition.x -= 0.5;
  },

  render: function() {
    //game.debug.text(game.time.physicsElapsed, 32, 32);
    //this.game.debug.body(this.gumbon);
    //game.debug.bodyInfo(player, 16, 24);
  }
};
