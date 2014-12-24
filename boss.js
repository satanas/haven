'use strict';

var Acerbus = function(game, player, x, y, fight) {
  Phaser.Sprite.call(this, game, x, y, 'acerbus', 0);

  this.player = player;
  this.facing = 'left';
  this.health = 100;
  this.hurt = false;
  this.hurtTime = 0;
  this.dashSpeed = 350;
  this.phase = 0;
  this.startingDelay = 2.5;
  this.startingTime = this.game.time.time;
  this.invincibilityTime = 0.100;
  this.phases = [
    new DashPhase(this, game),
    new LaughPhase(this, game),
    new TeleportPhase(this, game, player)
  ];

  this.game.physics.arcade.enableBody(this);
  this.body.gravity.y = 1000;
  groups.enemies.add(this);
  this.currPhase = this.phases[this.phase % 3];
  this.currPhase.start();
};

Acerbus.prototype = Object.create(Phaser.Sprite.prototype);
Acerbus.prototype.constructor = Acerbus;

Acerbus.prototype.update = function() {
  this.game.physics.arcade.collide(this, groups.platforms);
  this.currPhase.update();
  if (this.currPhase.ended) {
    this.phase += 1;
    this.currPhase = this.phases[this.phase % 3];
    this.currPhase.start();
    console.log('ended', this.phase, this.currPhase);
  }
};

Acerbus.prototype.takeDamage = function() {
  console.log('hit');
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
    if ((this.currStep.duration > 0) && (this.game.time.elapsedSecondsSince(this.stepStart) >= this.currStep.duration)) {
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
        console.log('ended');
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
      duration: 0.5,
      callback: function(self){}
    },
    {
      duration: -1,
      callback: this.preparation
    },
    {
      duration: 1.5,
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
    this.parent.x = 544;
    this.next();
  }
};

DashPhase.prototype.checkLeftLimit = function() {
  if (this.parent.x < 32 && this.parent.facing === 'left') {
    this.parent.body.velocity.x = 0;
    this.parent.facing = 'right';
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
  self.parent.tint = 0xff0000;
};

DashPhase.prototype.execution = function(self) {
  self.parent.tint = 0xffffff;
  if (self.parent.facing === 'right') {
    self.parent.body.velocity.x = self.parent.dashSpeed;
  } else {
    self.parent.body.velocity.x = -1 * self.parent.dashSpeed;
  }

  self.checkRightLimit();
  self.checkLeftLimit();

  //if (self.parent.x > 544) {
  //  self.parent.body.velocity.x = 0;
  //  self.parent.facing = 'left';
  //  self.parent.x = 544;
  //  self.next();
  //}

  //if (self.parent.x < 32) {
  //  self.parent.body.velocity.x = 0;
  //  self.parent.facing = 'right';
  //  self.parent.x = 32;
  //  self.next();
  //}
};

var LaughPhase = function(parent, game) {
  Phase.call(this, game, 1,
    {
      duration: 0.5,
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
      duration: 2,
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
      duration: 0.5,
      callback: function(self){}
    },
    {
      duration: -1,
      callback: this.preparation
    },
    {
      duration: 1,
      callback: this.warning
    },
    {
      duration: 0.5,
      callback: this.execution
    }
  );
  this.player = player;
  this.game = game;
  this.parent = parent;
  this.shadow = null;
};

TeleportPhase.prototype = Object.create(Phase.prototype);
TeleportPhase.prototype.constructor = TeleportPhase;

TeleportPhase.prototype.preparation = function(self) {
  self.parent.tint = 0xffffff;
  self.shadow = self.game.add.sprite(self.player.x, self.parent.y, 'shadow');
  self.shadow.animations.add('main');
  self.shadow.animations.play('main', 17, true);
  self.next();
};

TeleportPhase.prototype.warning = function(self) {
};

TeleportPhase.prototype.execution = function(self) {
  self.parent.x = self.shadow.x;
  self.shadow.kill();
};
