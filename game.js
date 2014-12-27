'use strict';

var Game = function() {}

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

    groups.items = this.game.add.group();
    groups.items.enableBody = true;

    this.map = this.game.add.tilemap('map');
    this.map.addTilesetImage('MARIO', 'mario');
    groups.platforms = this.map.createLayer('Platforms');
    this.back_deco = this.map.createLayer('Back Decorations');
    this.front_deco = this.map.createLayer('Front Decorations');
    this.map.setCollisionBetween(1, 120, true, 'Platforms');
    groups.platforms.resizeWorld();

    var self = this;
    this.map.objects['Objects'].forEach(function(e) {
      var y = e.y - self.map.tileHeight;
      if (e.properties.type === 'diamond') {
        var diamond = new Diamond(self.game, e.x, y);
      } else if (e.properties.type === 'extralife') {
        var life = new ExtraLife(self.game, e.x, y);
      }
    });

    this.map.objects['Traps'].forEach(function(e) {
      var y = e.y - self.map.tileHeight;
      if (e.properties.type === 'spike') {
        var item = new Spike(self.game, e.x, y);
      }
    });

    this.map.objects['Enemies'].forEach(function(e) {
      var y = e.y - self.map.tileHeight;
      if (e.properties.type === 'gumbon') {
        var item = new Gumbon(self.game, e.x, y);
      } else if (e.properties.type === 'snailbot') {
        var item = new Snailbot(self.game, e.x, y);
      } else if (e.properties.type === 'porktaicho') {
        var item = new Porktaicho(self.game, self.player, e.x, y);
      } else if (e.properties.type === 'superflowah') {
        var item = new SuperFlowah(self.game, e.x, y);
      } else if (e.properties.type === 'ladybug') {
        var item = new Ladybug(self.game, e.x, y);
      }
    });

    if (debug) {
      groups.platforms.debug = true;
    }

    this.player = new Alysa(this.game, 250, 170);
    //this.boss = new Acerbus(this.game, this.player, 544, 364);

    this.clock = new Clock(120, this.game);
    this.clock.start();

    this.game.world.bringToTop(groups.enemies);
    this.game.world.bringToTop(groups.items);
    this.game.world.bringToTop(groups.bullets);
  },

  update: function() {
    if (this.clock.ended && this.player.status !== 'dying') {
      this.player.die('timeout');
    }

    if (this.player.death){
      console.log('death effect');
      this.player.body.enable = false;
      return;
    }
    this.bg1.tilePosition.x -= 0.5;
  },

  render: function() {
    if (debug) {
      //this.game.debug.text(game.time.physicsElapsed, 32, 32);
      //this.game.debug.bodyInfo(this.player, 10, 20);
      this.game.debug.body(this.player);
      var self = this;
      groups.enemies.forEach(function(e) {
        self.game.debug.body(e);
      });
      groups.items.forEach(function(e) {
        self.game.debug.body(e);
      });
    }
  }
};
