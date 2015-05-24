'use strict';

var HUD = function(player, clock, boss) {
  this.player = player;
  this.boss = boss;
  this.clock = clock;
  this.blinkDelay = 150;
  this.blinkTime = 0;
  this.maxBossHearts = 15;

  this.face = game.add.sprite(0, 7, 'alysa-hud', 0, groups.hud);
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

  if (this.boss) {
    this.face = game.add.sprite(590, 7, 'acerbus-hud', 0, groups.hud);
    this.face.fixedToCamera = true;

    this.bossHealth = [];
    for (var i=0; i < this.maxBossHearts; i++) {
      this.bossHealth.push(game.add.sprite(560 - (18 * i), 17, 'heart', 0, groups.hud));
      this.bossHealth[i].fixedToCamera = true;
    }
  }

  this.diamondIcon = game.add.sprite(10, 48, 'diamond-hud', 0, groups.hud);
  this.diamondsSeparator = game.add.bitmapText(48, 57, 'press_start', 'x', 12);
  this.diamonds = game.add.bitmapText(67, 53, 'press_start', game.global.diamonds.toString(), 20);
  this.diamondIcon.fixedToCamera = true;
  this.diamondsSeparator.fixedToCamera = true;
  this.diamonds.fixedToCamera = true;

  if (this.clock !== null) {
    this.timer = game.add.sprite(514, 12, 'clock', 0, groups.hud);
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
    this.health[i].frame = 4;
  }
  for (var i=0; i < this.player.health; i++) {
    this.health[i].frame = 0;
  }

  if (this.boss) {
    var currPhase = Math.ceil(this.boss.health / this.maxBossHearts) - 1;
    var nextPhase = (currPhase <= 0) ? 4 : currPhase - 1;
    var hearts = this.boss.health % this.maxBossHearts;
    hearts = hearts === 0 ? 15: hearts;

    console.log(this.boss.health, currPhase, nextPhase, hearts);
    for (var i=0; i < this.maxBossHearts; i++) {
      this.bossHealth[i].frame = nextPhase;
    }
    if (this.boss.health > 0) {
      for (var i=0; i < hearts; i++) {
        this.bossHealth[i].frame = currPhase;
      }
    }
  }

  this.diamonds.setText(game.global.diamonds.toString());
};
