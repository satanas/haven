'use strict';

var Acerbus = function(game, player, x, y, fight) {
  Enemy.call(this, game, x, y, 'acerbus', 'left', 0);

  this.player = player;
  this.health = game.global.maxBossHealth;
  this.willDrop = false;
  this.dashSpeed = 700;
  this.walkingSpeed = 160;
  this.phase = 0;
  this.invincibilityTime = 150;
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
  this.animations.add('walk-right', [25, 26, 27, 28, 29, 30], 20, true);
  this.animations.add('hurt-left', [21, 22], 20, true);
  this.animations.add('hurt-right', [46, 47], 20, true);
  this.pattern = [1, 2, 0, 2, 3, 1, 0, 3, 2];

  this.game.physics.arcade.enableBody(this);
  this.body.gravity.y = 1000;
  groups.enemies.add(this);

  this.nextPhase();
};

Acerbus.prototype = Object.create(Enemy.prototype);
Acerbus.prototype.constructor = Acerbus;

Acerbus.prototype.update = function() {
  this.tileCollisions();
  this.currPhase.update();
  if (this.currPhase.ended) {
    this.phase += 1;
    this.nextPhase();
  }
  this.recover();
};

Acerbus.prototype.nextPhase = function() {
  this.currPhase = this.phases[this.pattern[this.phase % this.pattern.length]];
  this.currPhase.start();
};

Acerbus.prototype.chasePlayer = function() {
  this.facePlayer();

  if (this.chasing) {
    if (this.facing === 'left') {
      this.body.velocity.x = -1 * this.walkingSpeed;
      this.animations.play('walk-left');
    } else {
      this.body.velocity.x = this.walkingSpeed;
      this.animations.play('walk-right');
    }
  } else {
    this.chasing = true;
    this.chaseStart = this.game.time.time;
  }
};

Acerbus.prototype.stopChasing = function(player) {
  this.body.velocity.x = 0;
  this.animations.stop();
  this.renderStand();
  this.chasing = false;
};

Acerbus.prototype.renderStand = function() {
  if (this.facing === 'right') {
    this.frame = 25;
  } else {
    this.frame = 0;
  }
};

Acerbus.prototype.renderShoryuken = function() {
  if (this.facing === 'right') {
    this.frame = 23;
  } else {
    this.frame = 48;
  }
};

Acerbus.prototype.facePlayer = function() {
  if (this.x > this.player.x) {
    this.facing = 'left';
  } else {
    this.facing = 'right';
  }
};

var Phase = function(game, cycles, idle, preparation, warning, execution, ending) {
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
    this.parent.invincible = false;
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
    } else if (this.currStep === this.steps.prep) {
      this.currStep = this.steps.warn;
    } else if (this.currStep === this.steps.warn) {
      this.currStep = this.steps.exec;
    } else if (this.currStep === this.steps.exec) {
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
      callback: this.idle
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

DashPhase.prototype.idle = function(self) {
  self.parent.invincible = false;
  self.parent.animations.stop();
  self.parent.facePlayer();
  self.parent.renderStand();
};

DashPhase.prototype.preparation = function(self) {
  self.parent.invincible = false;
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
  } else {
    self.parent.animations.play('walk-' + self.parent.facing);
  }
  self.checkRightLimit();
  self.checkLeftLimit();
};

DashPhase.prototype.warning = function(self) {
  self.moving = null;
  self.parent.invincible = true;
  self.parent.animations.stop();
  self.parent.facePlayer();
  self.parent.renderStand();
};

DashPhase.prototype.execution = function(self) {
  self.parent.invincible = true;
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

DashPhase.prototype.checkRightLimit = function() {
  if (this.parent.x > 572 && this.parent.facing === 'right') {
    this.parent.body.velocity.x = 0;
    this.parent.facing = 'left';
    this.parent.animations.stop();
    this.parent.facePlayer();
    this.next();
  }
};

DashPhase.prototype.checkLeftLimit = function() {
  if (this.parent.x < 32 && this.parent.facing === 'left') {
    this.parent.body.velocity.x = 0;
    this.parent.facing = 'right';
    this.next();
  }
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
  console.log('laughing', self.parent.invincible);
  //self.parent.tint = 0xfab000;
};

LaughPhase.prototype.end = function() {
  console.log('end laughing');
  this.ended = true;
};

var TeleportPhase = function(parent, game, player) {
  Phase.call(this, game, 3,
    {
      duration: 500,
      callback: this.idle
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
  this.player = player;
  this.game = game;
  this.parent = parent;
  this.shadow = null;
  this.shoryuken = false;
};

TeleportPhase.prototype = Object.create(Phase.prototype);
TeleportPhase.prototype.constructor = TeleportPhase;

TeleportPhase.prototype.idle = function(self) {
  self.parent.invincible = false;
  self.parent.animations.stop();
  self.parent.facePlayer();
  self.parent.renderStand();
};

TeleportPhase.prototype.preparation = function(self) {
  self.parent.facePlayer();
  self.parent.renderStand();
  self.shoryuken = false;
  self.shadow = self.game.add.sprite(self.player.x, self.parent.y, 'shadow');
  self.shadow.animations.add('main');
  self.shadow.animations.play('main', 17, true);
  self.next();
};

TeleportPhase.prototype.warning = function(self) {
  self.invincible = true;
  self.parent.facePlayer();
  self.parent.renderStand();
};

TeleportPhase.prototype.execution = function(self) {
  self.parent.invincible = true;
  if (self.shoryuken) {
    if (self.parent.body.velocity.y === 0) {
      self.parent.renderStand();
      self.next();
    } else {
      self.parent.renderShoryuken();
    }
  } else {
    self.parent.x = self.shadow.x;
    self.parent.body.velocity.y = -900;
    self.shadow.destroy();
    self.shoryuken = true;
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
  //this.game.add.existing(this);
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
      callback: this.idle
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

WavePhase.prototype.idle = function(self) {
  self.parent.invincible = false;
};

WavePhase.prototype.preparation = function(self) {
  self.wave = null;
  self.parent.invincible = true;
  self.parent.chasePlayer();
};

WavePhase.prototype.warning = function(self) {
  self.parent.invincible = true;
  self.parent.tint = 0x000000;
  self.parent.stopChasing();
};

WavePhase.prototype.execution = function(self) {
  self.parent.invincible = true;
  self.parent.tint = 0xffffff;
  if (self.wave === null) {
    //self.wave = new Wave(self.game, self.parent.x, self.parent.y, self.parent.facing);
    self.wave = new Shuriken(self.game, self.parent.x, self.parent.y + 12, self.parent.facing);
  }
};

var Shuriken = function(game, x, y, direction) {
  Phaser.Sprite.call(this, game, x, y, 'shuriken', 0);

  this.speed = 560;
  this.game.physics.arcade.enable(this);
  this.anchor.setTo(0.5, 0.5);
  this.body.allowGravity = false;
  if (direction === 'left') {
    this.body.velocity.x = -1 * this.speed;
  } else {
    this.body.velocity.x = this.speed;
  }
  groups.enemies.add(this);
  //this.game.add.existing(this);
};

Shuriken.prototype = Object.create(Phaser.Sprite.prototype);
Shuriken.prototype.constructor = Shuriken;

Shuriken.prototype.update = function() {
  this.angle += 15;
  if ((this.x + this.width < 0) || (this.x > this.game.world.width)) {
    this.destroy();
  }
};
