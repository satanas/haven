'use strict';

function Game() {}

Game.prototype = {
  create: function() {
    console.log('game');
    this.map = null;
    this.player = null;

    this.game.stage.backgroundColor = '#3498db';
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 300;

    this.bg1 = game.add.tileSprite(0, 0, 640, 480, 'bg');
    this.bg1.fixedToCamera = true;
    this.bullets = this.game.add.group();
    this.bullets.enableBody = true;

    this.platforms = this.game.add.group();
    this.platforms.enableBody = true;

    this.map = this.game.add.tilemap('map');
    this.map.addTilesetImage('MARIO', 'mario');
    this.layer = this.map.createLayer('Platforms');
    this.back_deco = this.map.createLayer('Back Decorations');
    this.front_deco = this.map.createLayer('Front Decorations');
    this.map.setCollisionBetween(1, 120, true, 'Platforms');
    //layer.debug = true;
    this.layer.resizeWorld();

    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.player = new Alysa(this.game, 250, 170, this.cursors, this.bullets);
    this.game.add.existing(this.player);

    this.game.world.bringToTop(this.bullets);

    this.gumbon = new Gumbon(this.game, 100, 100, 0);
    this.game.add.existing(this.gumbon);
  },

  update: function() {
    if (this.player.death){
      console.log('death effect');
      this.player.body.enable = false;
      return;
    }
    this.bg1.tilePosition.x -= 0.5;

    this.game.physics.arcade.collide(this.player, this.layer);
    this.game.physics.arcade.collide(this.gumbon, this.layer);
    this.game.physics.arcade.collide(this.bullets, this.layer, this.bulletCollision);
  },

  render: function() {
    //game.debug.text(game.time.physicsElapsed, 32, 32);
    //this.game.debug.body(this.gumbon);
    //game.debug.bodyInfo(player, 16, 24);
  },

  bulletCollision: function(bullet, platform) {
    bullet.kill();
  }
};
