'use strict';

var Game = function() {}

Game.prototype = {
  create: function() {
    this.map = null;
    this.player = null;
    this.boss = null;
    this.clock = null;

    this.game.stage.backgroundColor = '#3498db';
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 300;

    if (this.bgmSound === undefined) {
      this.game.sound.stopAll();
      this.bgmSound = this.game.add.audio('ingame', 0.7, true);
      this.bgmSound.onDecoded.add(this.start, this);
    }

    this.bg1 = game.add.tileSprite(0, 0, 640, 480, 'bg');
    this.bg1.fixedToCamera = true;
    groups.bullets = this.game.add.group();
    groups.bullets.enableBody = true;

    groups.enemies = this.game.add.group();
    groups.enemies.enableBody = true;

    groups.blockEnemies= this.game.add.group();
    groups.blockEnemies.enableBody = true;

    groups.items = this.game.add.group();
    groups.items.enableBody = true;

    groups.checkpoints = this.game.add.group();
    groups.checkpoints.enableBody = true;

    groups.platforms = this.game.add.group();
    groups.platforms.enableBody = true;

    groups.hud = this.game.add.group();

    this.map = this.game.add.tilemap('map');
    this.map.addTilesetImage('MARIO', 'mario');
    groups.tiles = this.map.createLayer('Tiles');
    this.back_deco = this.map.createLayer('Back Decorations');
    this.front_deco = this.map.createLayer('Front Decorations');
    this.map.setCollisionBetween(1, 124, true, 'Tiles');
    groups.tiles.resizeWorld();

    if (this.game.global.lastCheckpoint) {
      this.player = new Alysa(this.game, this.game.global.lastCheckpoint.origX, this.game.global.lastCheckpoint.origY);
    } else {
      this.player = new Alysa(this.game, 280, 370);
    }

    var self = this;
    this.map.objects['Objects'].forEach(function(e) {
      var y = e.y - self.map.tileHeight;
      var add = true;
      self.game.global.items.forEach(function(item) {
        if (item.x === e.x && item.y === y) add = false;
      });
      if (add) {
        if (e.properties.type === 'diamond') {
          var item = new Diamond(self.game, e.x, y);
        } else if (e.properties.type === 'extralife') {
          var item = new ExtraLife(self.game, e.x, y);
        }
      }
      if (e.properties.type === 'checkpoint') {
        var origX = parseInt(e.properties.orig_x);
        var origY = parseInt(e.properties.orig_y);
        var item = new Checkpoint(self.game, e.x, y, origX, origY);
      } else if (e.properties.type === 'clock') {
        var initTime = e.properties.init_time || 300;
        var criticalTime = e.properties.critical_time || 20;
        self.clock = new Clock(self.game);
        self.clock.start(initTime, criticalTime);
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
      var range = (e.properties.range !== undefined) ? parseInt(e.properties.range) : -1;

      if (e.properties.type === 'acerbus') {
        self.boss = new Acerbus(self.game, self.player, e.x, y);
      } else if (e.properties.type === 'gumbon') {
        //var item = new Gumbon(self.game, e.x, y, facing, e.properties.zombie, range, self.map);
      } else if (e.properties.type === 'snailbot') {
        var item = new Snailbot(self.game, e.x, y, facing, range, self.map);
      } else if (e.properties.type === 'porktaicho') {
        //var item = new Porktaicho(self.game, self.player, e.x, y, facing, e.properties.action, range);
      } else if (e.properties.type === 'ambusher') {
        var position = e.properties.position || 'moveable';
        var item = new Ambusher(self.game, self.player, e.x, y, facing, position);
      } else if (e.properties.type === 'ladybug') {
        var item = new Ladybug(self.game, e.x, y, facing, range);
      } else if (e.properties.type === 'medusa') {
        range = (range === -1) ? 300 : range;
        var item = new Medusa(self.game, e.x, y, facing, range);
      } else if (e.properties.type === 'cuirass') {
        var item = new Cuirass(self.game, self.player, e.x, y, facing);
      } else if (e.properties.type === 'wasp') {
        var xrange = (e.properties.xrange) ? parseInt(e.properties.xrange) : 140;
        var yrange = (e.properties.yrange) ? parseInt(e.properties.yrange) : 40;
        //var item = new Wasp(self.game, self.player, e.x, y, facing, xrange, yrange);
      } else if (e.properties.type === 'skeleton') {
        var item = new Skeleton(self.game, e.x, y, facing, range);
      } else if (e.properties.type === 'carniplant') {
        var item = new Carniplant(self.game, e.x, y);
      } else if (e.properties.type === 'gunner') {
        var item = new Gunner(self.game, self.player, e.x, y);
      } else if (e.properties.type === 'cannon') {
        var item = new Cannon(self.game, self.player, e.x-30, y);
      } else if (e.properties.type === 'spike') {
        var item = new Spike(self.game, e.x, y);
      } else if (e.properties.type === 'lava') {
        var item = new Lava(self.game, e.x, y);
      } else if (e.properties.type === 'beartrap') {
        var item = new ClosingTrap(self.game, self.player, e.x, y, 'beartrap');
      } else if (e.properties.type === 'planttrap') {
        var item = new ClosingTrap(self.game, self.player, e.x, y, 'planttrap');
      } else if (e.properties.type === 'chandelkier') {
        var delay = e.properties.delay || 100;
        var item = new FallingTrap(self.game, self.player, e.x, y, 'chandelkier', repetitionType.FINITE, delay, warningType.ANIMATION);
      } else if (e.properties.type === 'fallingrock') {
        var delay = e.properties.delay || 100;
        var repetition = e.properties.repetition || repetitionType.FINITE;
        var item = new FallingTrap(self.game, self.player, e.x, y, 'rock', repetition, delay, warningType.RUMBLE);
      } else if (e.properties.type === 'stunningrock') {
        var yspeed = e.properties.yspeed || 900;
        var fallingdelay = e.properties.fallingdelay || 400;
        var idledelay = e.properties.idledelay || 1000;
        var item = new StunningRock(self.game, e.x, y, yspeed, fallingdelay, idledelay);
      }
    });

    if (debug) {
      groups.tiles.debug = true;
    }

    this.hud = new HUD(this.game, this.player, this.clock);

    this.game.world.bringToTop(groups.platforms);
    this.game.world.bringToTop(groups.enemies);
    this.game.world.bringToTop(groups.items);
    this.game.world.bringToTop(groups.bullets);
    this.game.world.bringToTop(groups.hud);
  },

  start: function() {
    this.bgmSound.play();
  },

  update: function() {
    if (this.clock !== null) {
      this.clock.update();

      if (this.clock.ended && this.player.status !== 'dying') {
        this.player.die(deadType.timeout);
      }
    }

    this.hud.update();

    if (this.player.death){
      this.player.body.enable = false;
      var self = this;
      this.game.plugin.fadeOut(0x000, 750, 0, function() {
        console.log('dead, rest', self.game.global.lives);
        if (self.game.global.lives < 1) {
          self.bgmSound = undefined;
          self.game.state.start('gameover');
        } else {
          self.game.state.start('death');
        }
      });
      //return;
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
