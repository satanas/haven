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

    groups.checkpoints = this.game.add.group();
    groups.checkpoints.enableBody = true;

    groups.platforms = this.game.add.group();
    groups.platforms.enableBody = true;

    this.map = this.game.add.tilemap('map');
    this.map.addTilesetImage('MARIO', 'mario');
    groups.tiles = this.map.createLayer('Tiles');
    this.back_deco = this.map.createLayer('Back Decorations');
    this.front_deco = this.map.createLayer('Front Decorations');
    this.map.setCollisionBetween(1, 120, true, 'Tiles');
    groups.tiles.resizeWorld();

    if (this.game.global.lastCheckpoint) {
      this.player = new Alysa(this.game, this.game.global.lastCheckpoint.origX, this.game.global.lastCheckpoint.origY);
    } else {
      this.player = new Alysa(this.game, 250, 170);
    }

    var self = this;
    this.map.objects['Objects'].forEach(function(e) {
      var y = e.y - self.map.tileHeight;
      if (e.properties.type === 'diamond') {
        var item = new Diamond(self.game, e.x, y);
      } else if (e.properties.type === 'extralife') {
        var item = new ExtraLife(self.game, e.x, y);
      } else if (e.properties.type === 'checkpoint') {
        var origX = parseInt(e.properties.orig_x);
        var origY = parseInt(e.properties.orig_y);
        var item = new Checkpoint(self.game, e.x, y, origX, origY);
      }
    });

    this.map.objects['Platforms'].forEach(function(e) {
      var y = e.y - self.map.tileHeight;
      if (e.properties.type === 'platform') {
        if (e.properties.action === 'move') {
          var direction = e.properties.direction;
          var min = e.properties.min || 100;
          var max = e.properties.max || 100;
          var item = new MovingPlatform(self.game, self.player, e.x, y, direction, min, max);
        } else if (e.properties.action === 'fall') {
          var lifetime = e.properties.lifetime || 1500
          var item = new FallingPlatform(self.game, self.player, e.x, y, lifetime);
        } else if (e.properties.action === 'ghost') {
          var item = new GhostPlatform(self.game, e.x, y);
        }
      }
    });

    this.map.objects['Enemies'].forEach(function(e) {
      var y = e.y - self.map.tileHeight;
      var facing = e.properties.facing || 'left';
      var range = (e.properties.range !== undefined) ? parseInt(e.properties.range) : 100;

      if (e.properties.type === 'acerbus') {
        self.boss = new Acerbus(self.game, self.player, e.x, y);
      } else if (e.properties.type === 'gumbon') {
        var item = new Gumbon(self.game, e.x, y, facing, e.properties.zombie, range);
      } else if (e.properties.type === 'snailbot') {
        var item = new Snailbot(self.game, e.x, y, facing, range);
      } else if (e.properties.type === 'porktaicho') {
        var item = new Porktaicho(self.game, self.player, e.x, y, facing, e.properties.action, range);
      } else if (e.properties.type === 'superflowah') {
        var item = new SuperFlowah(self.game, self.player, e.x, y);
      } else if (e.properties.type === 'ladybug') {
        var item = new Ladybug(self.game, e.x, y, facing, range);
      } else if (e.properties.type === 'medusa') {
        var item = new Medusa(self.game, e.x, y, facing, range);
      } else if (e.properties.type === 'cannon') {
        var item = new Cannon(self.game, self.player, e.x, y);
      } else if (e.properties.type === 'wasp') {
        var xrange = (e.properties.xrange) ? parseInt(e.properties.xrange) : 140;
        var yrange = (e.properties.yrange) ? parseInt(e.properties.yrange) : 40;
        var item = new Wasp(self.game, self.player, e.x, y, facing, xrange, yrange);
      } else if (e.properties.type === 'skeleton') {
        var item = new Skeleton(self.game, e.x, y, facing, range);
      } else if (e.properties.type === 'spike') {
        var item = new Spike(self.game, e.x, y);
      } else if (e.properties.type === 'lava') {
        var item = new Lava(self.game, e.x, y);
      } else if (e.properties.type === 'beartrap') {
        var item = new BearTrap(self.game, self.player, e.x, y);
      }
    });

    if (debug) {
      groups.tiles.debug = true;
    }

    this.clock = new Clock(300, this.game);
    this.clock.start();

    this.game.world.bringToTop(groups.platforms);
    this.game.world.bringToTop(groups.enemies);
    this.game.world.bringToTop(groups.items);
    this.game.world.bringToTop(groups.bullets);
  },

  update: function() {
    if (this.clock.ended && this.player.status !== 'dying') {
      this.player.die(deadType.timeout);
    }

    if (this.player.death){
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
      groups.platforms.forEach(function(e) {
        self.game.debug.body(e);
      });
    }
  }
};
