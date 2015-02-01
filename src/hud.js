'use strict';

var HUD = function(game, player, clock) {
  this.game = game;
  this.player = player;
  this.clock = clock;
  this.widget = this.game.add.sprite(0, 0, 'hud', 0, groups.hud);
  this.widget.fixedToCamera = true;
  this.widget.alpha = 0.9;
  this.blinkDelay = 150;
  this.blinkTime = 0;

  this.face = this.game.add.sprite(0, 7, 'degradation', 0, groups.hud);
  this.face.fixedToCamera = true;

  this.lives = this.game.add.bitmapText(52, 61, 'press_start', this.game.global.lives.toString(), 9); //49
  this.lives.fixedToCamera = true;
  groups.hud.add(this.lives);

  if (this.clock !== null) {
    this.timer = this.game.add.sprite(255, 3, 'timer', 0, groups.hud);
    this.timer.fixedToCamera = true;

    this.time = this.game.add.bitmapText(305, 18, 'press_start', '300', 16);
    this.time.align = 'right';
    this.time.fixedToCamera = true;
    groups.hud.add(this.time);
  }
};

HUD.prototype.update = function(clock) {
  var faction = Math.floor(4 - (this.player.health / (this.game.global.maxHeroHealth / 4)));
  this.face.frame = faction;

  if (this.clock !== null) {
    this.time.setText(this.clock.getTime().toString());
    if (this.clock.isCritical()) {
      this.blinkTime += this.game.time.elapsed;
      this.timer.tint = 0xff0000;
      if (this.blinkTime >= this.blinkDelay) {
        this.blinkTime = 0;
        this.timer.alpha = (this.timer.alpha === 1.0) ? 0.0 : 1.0;
      }
    }
  }
};
