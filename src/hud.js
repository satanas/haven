'use strict';

var HUD = function(player, clock) {
  this.player = player;
  this.clock = clock;
  this.blinkDelay = 150;
  this.blinkTime = 0;

  this.face = game.add.sprite(0, 7, 'alysa-degradation', 0, groups.hud);
  this.face.fixedToCamera = true;
  this.livesSeparator = game.add.bitmapText(48, 20, 'press_start', 'x', 12);
  this.livesSeparator.fixedToCamera = true;
  this.lives = game.add.bitmapText(65, 17, 'press_start', game.global.lives.toString(), 20);
  this.lives.fixedToCamera = true;

  this.health = [];
  for (var i=0; i < this.player.health; i++) {
    this.health.push(game.add.sprite(100 + (18 * i), 17, 'heart', 0, groups.hud));
    this.health[i].fixedToCamera = true;
  }

  this.diamondIcon = game.add.sprite(10, 48, 'diamond-hud', 0, groups.hud);
  this.diamondsSeparator = game.add.bitmapText(48, 57, 'press_start', 'x', 12);
  this.diamonds = game.add.bitmapText(67, 53, 'press_start', game.global.diamonds.toString(), 20);
  this.diamondIcon.fixedToCamera = true;
  this.diamondsSeparator.fixedToCamera = true;
  this.diamonds.fixedToCamera = true;

  if (this.clock !== null) {
    this.timer = game.add.sprite(510, 2, 'timer', 0, groups.hud);
    this.timer.fixedToCamera = true;

    this.time = game.add.bitmapText(560, 18, 'press_start', '300', 20);
    this.time.align = 'right';
    this.time.fixedToCamera = true;
    groups.hud.add(this.time);
  }

  groups.hud.add(this.livesSeparator);
  groups.hud.add(this.lives);
};

HUD.prototype.update = function(clock) {
  var faction = Math.floor(4 - (this.player.health / (game.global.maxHeroHealth / 4)));
  this.face.frame = faction;

  if (this.clock !== null) {
    this.time.setText(this.clock.getTime().toString());
    if (this.clock.isCritical()) {
      this.blinkTime += game.time.elapsed;
      this.timer.tint = 0xff0000;
      if (this.blinkTime >= this.blinkDelay) {
        this.blinkTime = 0;
        this.timer.alpha = (this.timer.alpha === 1.0) ? 0.0 : 1.0;
      }
    }
  }

  for (var i=0; i < game.global.maxHeroHealth; i++) {
    this.health[i].frame = 1;
  }
  for (var i=0; i < this.player.health; i++) {
    this.health[i].frame = 0;
  }

  this.diamonds.setText(game.global.diamonds.toString());
};
