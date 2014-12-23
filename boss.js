'use strict';

var Acerbus = function(game, x, y, fight) {
  Phaser.Sprite.call(this, game, x, y, 'acerbus', 0);

  this.facing = 'left';
  this.health = 100;
  this.hurt = false;
  this.hurtTime = 0;
  this.runningSpeed = 320;
  this.phase = 0;
  this.startingDelay = 2.5;
  this.startingTime = this.game.time.time;
  this.invincibilityTime = 0.100;
  this.phases = [
    new RunningPhase(this, game)
  ];

  this.game.physics.arcade.enableBody(this);
  this.body.gravity.y = 1000;
  groups.enemies.add(this);
  this.phases[0].start();
};

Acerbus.prototype = Object.create(Phaser.Sprite.prototype);
Acerbus.prototype.constructor = Acerbus;

Acerbus.prototype.update = function() {
  this.game.physics.arcade.collide(this, groups.platforms);
  this.phases[0].update();
  //if (this.phase === 0) {
  //  if (this.game.time.elapsedSecondsSince(this.startingTime) >= this.startingDelay) {
  //    this.phase = 1;
  //    this.phases[1].start = this.game.time.time;
  //    this.phases[1].step = 'start';
  //    console.log('starting');
  //  }
  //} else if (this.phase === 1) {
  //  if (this.phases[1].step === 'start') {
  //    console.log('phase 1 - start');
  //    if (this.game.time.elapsedSecondsSince(this.phases[1].start) >= this.phases[1].delay) {
  //      this.phases[1].step = 'prep';
  //      this.phases[1].start = this.game.time.time;
  //    }
  //  } else if (this.phases[1].step === 'prep') {
  //    console.log('phase 1 - prep');
  //    this.tint = 0xfff000;
  //    if (this.game.time.elapsedSecondsSince(this.phases[1].start) >= this.phases[1].prep) {
  //      this.phases[1].step = 'exec';
  //      this.tint = 0x000000;
  //    }
  //  } else if (this.phases[1].step === 'exec') {
  //    console.log('phase 1 - exec');
  //    this.body.velocity.x = -31;
  //  }
  //}
};

// delay
// warning
// execution

var Phase = function(game, cycles, preparation, idle, warning, execution) {
  this.game = game;
  this.totalCycles = cycles;
  this.currCycles = 0;
  this.ended = false;
  this.stepStart = 0;
  this.steps = {
    prep: preparation,
    idle: idle,
    warn: warning,
    exec: execution
  };
  this.currStep = this.steps.idle;

  this.start = function() {
    this.currCycles = this.totalCycles;
    this.currStep = this.steps.idle;
    this.stepStart = this.game.time.time;
    console.log('started', this.currStep);
  };

  this.update = function() {
    this.currStep.callback(this);
    if ((this.currStep.duration > 0) && (this.game.time.elapsedSecondsSince(this.stepStart) >= this.currStep.duration)) {
      this.next();
    }
  };

  this.next = function() {
    console.log('nexting');
    if (this.currStep === this.steps.idle) {
      this.currStep = this.steps.prep;
    } else if (this.currStep === this.steps.prep) {
      this.currStep = this.steps.warn;
    } else if (this.currStep === this.steps.warn) {
      this.currStep = this.steps.exec;
    } else if (this.currStep === this.steps.exec) {
      if (this.currCycles > 0) {
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

var RunningPhase = function(parent, game) {
  Phase.call(this, game, 4,
    {
      duration: -1,
      callback: this.preparation
    },
    {
      duration: 1.5,
      callback: this.idle
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
};

RunningPhase.prototype = Object.create(Phase.prototype);
RunningPhase.prototype.constructor = RunningPhase;

RunningPhase.prototype.preparation = function(self) {
  console.log('running - prep', self);
  if (self.parent.facing === 'right') {
    self.parent.x = 32;
  } else {
    self.parent.x = 544;
  }
  self.next();
};

RunningPhase.prototype.idle = function(self) {
  //console.log('running - idle', self);
};

RunningPhase.prototype.warning = function(self) {
  self.parent.tint = 0xff0000;
};

RunningPhase.prototype.execution = function(self) {
  self.parent.tint = 0xffffff;
  if (self.parent.facing === 'right') {
    self.parent.body.velocity.x = self.parent.runningSpeed;
  } else {
    self.parent.body.velocity.x = -1 * self.parent.runningSpeed;
  }

  if (self.parent.x > 544) {
    self.parent.body.velocity.x = 0;
    self.parent.facing = 'left';
    self.parent.x = 544;
    self.next();
  }

  if (self.parent.x < 32) {
    self.parent.body.velocity.x = 0;
    self.parent.facing = 'right';
    self.parent.x = 32;
    self.next();
  }
};
