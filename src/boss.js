'use strict';

var Acerbus = function(game, player, x, y, fight) {
  Enemy.call(this, game, x, y, 'acerbus', 'left', 0);

  this.player = player;
  this.health = game.global.maxBossHealth;
  this.willDrop = false;
  this.dashSpeed = 550;
  this.walkingSpeed = 160;
  this.phase = 0;
  this.chaseDelay = 250;
  this.chasing = false;
  this.chaseStart = 0;

  this.phases = [
    new DashPhase(this, game),
    new LaughPhase(this, game),
    new TeleportPhase(this, game, player),
    new WavePhase(this, game, player)
  ];

  this.animations.add('walk-left', [0, 1, 2, 3, 4, 5], 20, true);
  this.animations.add('walk-right', [6, 7, 8, 9, 10, 11], 20, true);
  //this.pattern = [2, 0, 2, 0, 3];
  this.pattern = [2, 2];

  this.game.physics.arcade.enableBody(this);
  this.body.gravity.y = 1000;
  groups.enemies.add(this);

  this.nextPhase();
};

Acerbus.prototype = Object.create(Enemy.prototype);
Acerbus.prototype.constructor = Acerbus;

Acerbus.prototype.update = function() {
  this.tileCollisions();
  this.recover();
  this.currPhase.update();
  if (this.currPhase.ended) {
    this.phase += 1;
    this.nextPhase();
  }
};

Acerbus.prototype.nextPhase = function() {
  this.currPhase = this.phases[this.pattern[this.phase % this.pattern.length]];
  this.currPhase.start();
};

Acerbus.prototype.chaseCharacter = function(player) {
  if (this.chasing) {
    //console.log('chasing', player.x);
    if (this.facing === 'left') {
      this.body.velocity.x = -1 * this.walkingSpeed;
      this.animations.play('walk-left');
    } else {
      this.body.velocity.x = this.walkingSpeed;
      this.animations.play('walk-right');
    }
    if (this.game.time.elapsedSince(this.chaseStart) > this.chaseDelay) {
      this.animations.stop();
      this.chasing = false;
    }
  } else {
    this.facePlayer();
    this.chasing = true;
    this.chaseStart = this.game.time.time;
    //console.log('recalculating', this.facing);
  }
};

Acerbus.prototype.stopChasing = function(player) {
  this.body.velocity.x = 0;
  this.animations.stop();
};

Acerbus.prototype.renderStand = function() {
  if (this.facing === 'right') {
    this.frame = 25;
  } else {
    this.frame = 0;
  }
};

Acerbus.prototype.facePlayer = function() {
  if (this.x > this.player.x) {
    this.facing = 'left';
    this.frame = 0;
  } else {
    this.facing = 'right';
    this.frame = 25;
  }
};

var Phase = function(game, cycles, idle, preparation, warning, execution) {
  this.game = game;
  this.totalCycles = cycles;
  this.currCycles = 0;
  this.ended = false;
  this.stepStart = 0;
  this.steps = {
    idle: idle,
    prep: preparation,
    warn: warning,
    exec: execution
  };
  this.currStep = this.steps.idle;

  this.start = function() {
    this.ended = false;
    this.currCycles = this.totalCycles;
    this.currStep = this.steps.idle;
    this.stepStart = this.game.time.time;
  };

  this.update = function() {
    if (this.ended) return;

    this.currStep.callback(this);
    if ((this.currStep.duration > 0) && (this.game.time.elapsedSince(this.stepStart) >= this.currStep.duration)) {
      this.next();
    }
  };

  this.next = function() {
    if (this.currStep === this.steps.idle) {
      this.currStep = this.steps.prep;
      this.invincible = true;
      this.parent.invincible = true;
    } else if (this.currStep === this.steps.prep) {
      this.currStep = this.steps.warn;
      this.parent.invincible = true;
    } else if (this.currStep === this.steps.warn) {
      this.currStep = this.steps.exec;
      this.parent.invincible = true;
    } else if (this.currStep === this.steps.exec) {
      this.parent.invincible = false;
      if (this.currCycles > 1) {
        this.currStep = this.steps.idle;
        this.currCycles -= 1;
      } else {
        this.end();
      }
    }
    this.stepStart = this.game.time.time;
  };

  this.end = function() {
    this.ended = true;
  };
};

var DashPhase = function(parent, game) {
  Phase.call(this, game, 2,
    {
      duration: 500,
      callback: function(self){}
    },
    {
      duration: -1,
      callback: this.preparation
    },
    {
      duration: 600,
      callback: this.warning
    },
    {
      duration: -1,
      callback: this.execution
    }
  );
  this.game = game;
  this.parent = parent;
  this.moving = null;
};

DashPhase.prototype = Object.create(Phase.prototype);
DashPhase.prototype.constructor = DashPhase;

DashPhase.prototype.checkRightLimit = function() {
  if (this.parent.x > 544 && this.parent.facing === 'right') {
    this.parent.body.velocity.x = 0;
    this.parent.facing = 'left';
    this.parent.renderStand();
    this.parent.x = 544;
    this.next();
  }
};

DashPhase.prototype.checkLeftLimit = function() {
  if (this.parent.x < 32 && this.parent.facing === 'left') {
    this.parent.body.velocity.x = 0;
    this.parent.facing = 'right';
    this.parent.renderStand();
    this.parent.x = 32;
    this.next();
  }
};

DashPhase.prototype.preparation = function(self) {
  if (self.moving === null) {
    if (self.parent.x >= self.game.world.centerX) {
      self.parent.facing = 'right';
      self.parent.body.velocity.x = 150;
      self.moving = 'right';
    } else if (self.parent.x < self.game.world.centerX) {
      self.parent.facing = 'left';
      self.parent.body.velocity.x = -150;
      self.moving = 'left';
    }
  }
  self.checkRightLimit();
  self.checkLeftLimit();
};

DashPhase.prototype.warning = function(self) {
  self.moving = null;
};

DashPhase.prototype.execution = function(self) {
  if (self.parent.facing === 'right') {
    self.parent.body.velocity.x = self.parent.dashSpeed;
    self.parent.frame = 49;
  } else {
    self.parent.body.velocity.x = -1 * self.parent.dashSpeed;
    self.parent.frame = 24;
  }

  self.checkRightLimit();
  self.checkLeftLimit();
};

var LaughPhase = function(parent, game) {
  Phase.call(this, game, 1,
    {
      duration: 500,
      callback: function(self){}
    },
    {
      duration: -1,
      callback: function(self) { self.next(); }
    },
    {
      duration: -1,
      callback: function(self) { self.next(); }
    },
    {
      duration: 2000,
      callback: this.execution
    }
  );
  this.game = game;
  this.parent = parent;
};

LaughPhase.prototype = Object.create(Phase.prototype);
LaughPhase.prototype.constructor = LaughPhase;

LaughPhase.prototype.execution = function(self) {
  console.log('laughing');
  self.parent.tint = 0xfab000;
};

var TeleportPhase = function(parent, game, player) {
  Phase.call(this, game, 3,
    {
      duration: 500,
      callback: function(self){}
    },
    {
      duration: -1,
      callback: this.preparation
    },
    {
      duration: 600,
      callback: this.warning
    },
    {
      duration: 3000,
      callback: this.execution
    }
  );
  this.player = player;
  this.game = game;
  this.parent = parent;
  this.shadow = null;
  this.shoryuken = false;
};

TeleportPhase.prototype = Object.create(Phase.prototype);
TeleportPhase.prototype.constructor = TeleportPhase;

TeleportPhase.prototype.preparation = function(self) {
  self.parent.facePlayer();
  self.shoryuken = false;
  self.shadow = self.game.add.sprite(self.player.x, self.parent.y, 'shadow');
  self.shadow.animations.add('main');
  self.shadow.animations.play('main', 17, true);
  self.alpha = 0;
  self.next();
};

TeleportPhase.prototype.warning = function(self) {
  self.parent.facePlayer();
};

TeleportPhase.prototype.execution = function(self) {
  if (self.shoryuken) {
    if (self.parent.body.velocity.y === 0) {
      self.parent.renderStand();
      self.next();
    }
  } else {
    self.parent.x = self.shadow.x;
    self.parent.body.velocity.y = -900;
    self.shadow.destroy();
    self.shoryuken = true;
    if (self.parent.facing === 'right') {
      self.parent.frame = 23;
    } else {
      self.parent.frame = 48;
    }
  }
};

var Wave = function(game, x, y, direction) {
  Phaser.Sprite.call(this, game, x, y, 'wave', 0);

  this.speed = 560;
  this.game.physics.arcade.enable(this);
  this.body.allowGravity = false;
  if (direction === 'left') {
    this.body.velocity.x = -1 * this.speed;
  } else {
    this.body.velocity.x = this.speed;
  }
  groups.enemies.add(this);
  this.game.add.existing(this);
  //self.wave.animations.add('main');
  //self.wave.animations.play('main', 17, true);
};

Wave.prototype = Object.create(Phaser.Sprite.prototype);
Wave.prototype.constructor = Wave;

Wave.prototype.update = function() {
  if ((this.x + this.width < 0) || (this.x > this.game.world.width)) {
    this.destroy();
  }
};

var WavePhase = function(parent, game, player) {
  Phase.call(this, game, 3,
    {
      duration: 500,
      callback: function(self){}
    },
    {
      duration: 1000,
      callback: this.preparation
    },
    {
      duration: 500,
      callback: this.warning
    },
    {
      duration: 600,
      callback: this.execution
    }
  );
  this.player = player;
  this.game = game;
  this.parent = parent;
  this.wave = null;
};

WavePhase.prototype = Object.create(Phase.prototype);
WavePhase.prototype.constructor = WavePhase;

WavePhase.prototype.preparation = function(self) {
  self.wave = null;
  self.parent.chaseCharacter(self.player);
};

WavePhase.prototype.warning = function(self) {
  self.parent.tint = 0x000000;
  self.parent.stopChasing();
};

WavePhase.prototype.execution = function(self) {
  console.log('exec', self.parent.facing);
  self.parent.tint = 0xffffff;
  if (self.wave === null) {
    self.wave = new Wave(self.game, self.parent.x, self.parent.y, self.parent.facing);
  }
};
