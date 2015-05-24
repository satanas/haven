'use strict';

function Intro() {}

Intro.prototype = {
  create: function() {
    this.step = 0;
    this.readyForNext = false;
    this.script = [
      new Dialog('king', 'Alysa, thanks for capture', 'Acerbus!'),
      new Dialog('alysa', 'It\'s an honor and it\'s', 'my job, your grace'),
      new Dialog('king', 'Well, let\'s put him in', 'the dungeon'),
      new Dialog('acerbus', 'HAHAHAHAHA... You really', 'think you got me?'),
      new Dialog('acerbus', 'FOOLS! You will pay for', 'your sins...'),
    ];
    game.stage.backgroundColor = '#fff';
    this.background = game.add.image(0, 0, 'throne-room');

    this.king = game.add.sprite(450, 310, 'king', 0);
    this.king.animations.add('talk', [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3], 10, false);

    this.alysa = game.add.sprite(160, 358, 'alysa', 0);
    this.alysa.animations.add('talk', [0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5], 10, false);
    this.alysa.animations.add('run', [8, 9, 10, 11, 12, 13, 14, 15], 12, true);

    this.acerbus = game.add.sprite(240, 350, 'acerbus', 6);
    this.acerbus.animations.add('talk', [6, 7, 8, 9, 10, 11, 6, 7, 8, 9, 10, 11], 7, false);
    //this.acerbus.animations.play('idle');
    this.chain = game.add.sprite(240, 376, 'energy-chain');
    this.chain.animations.add('main', null, 20, true);
    this.chain.animations.play('main');
    //var chainTween = game.add.tween(this.chain);
    //chainTween.to({y: 374}, 100, Phaser.Easing.Bounce.None, true).to({y: 378}, 100, Phaser.Easing.Bounce.None, true).loop(true);

    this.shadow = game.add.sprite(240, 350, 'shadow');
    this.shadow.animations.add('main');
    this.shadow.visible = false;

    this.portal = game.add.sprite(425, 250, 'portal');
    this.portal.animations.add('main', null, 30, true);
    this.portal.visible = false;

    this.kingDialog = game.add.sprite(41, -110, 'king-dialog');
    this.alysaDialog = game.add.sprite(41, -110, 'alysa-dialog');
    this.acerbusDialog = game.add.sprite(41, -110, 'acerbus-dialog');

    this.text1 = game.add.bitmapText(150, 50, 'press_start', '', 16);
    this.text2 = game.add.bitmapText(150, 75, 'press_start', '', 16);
    this.pressEnter = game.add.bitmapText(470, 105, 'press_start', 'Press Enter', 9);
    this.text1.visible = false;
    this.text2.visible = false;
    this.pressEnter.visible = false;

    this.bgmSound = game.add.audio('bgm-intro', 0.75, true);

    var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    enterKey.onDown.add(this.activate, this);

    game.sound.stopAll();
    //this.bgmSound.play();
    this.nextStep();
  },

  nextStep: function() {
    var facet = this.script[this.step].facet;
    var line1 = this.script[this.step].line1;
    var line2 = this.script[this.step].line2;

    var dialog = null, anim = null;
    if (facet === 'king') {
      dialog = this.kingDialog;
      anim = this.king.animations;
    } else if (facet === 'alysa') {
      dialog = this.alysaDialog;
      anim = this.alysa.animations;
    } else if (facet === 'acerbus') {
      dialog = this.acerbusDialog;
      anim = this.acerbus.animations;
    }
    this.currDialog = dialog;
    this.currAnim = anim;

    this.text1.setText(line1);
    this.text2.setText(line2);
    var tweenDialog = game.add.tween(this.currDialog);
    tweenDialog.to({y: 30}, 500, Phaser.Easing.Back.In, true).onComplete.add(function() {
      this.text1.visible = true;
      this.text2.visible = true;
      this.pressEnter.visible = true;
      this.readyForNext = true;
      this.currAnim.play('talk');
    }, this);
  },

  activate: function() {
    if (this.readyForNext && this.step < 5) {
      this.readyForNext = false;
      this.text1.visible = false;
      this.text2.visible = false;
      this.pressEnter.visible = false;
      var tweenDialog = game.add.tween(this.currDialog);
      tweenDialog.to({y: -110}, 500, Phaser.Easing.Back.Out, true).onComplete.add(function() {
        this.step += 1;
        if (this.step < 5) {
          this.nextStep();
        } else {
          this.startKidnaping();
        }
      }, this);
    }
  },

  startKidnaping: function() {
    this.acerbus.visible = false;
    this.shadow.visible = true;
    this.shadow.animations.play('main', 17, true);
    game.time.events.add(3000, this.doKidnaping, this);
  },

  doKidnaping: function() {
    //var exp = new Explosion(game, this.acerbus.x, this.acerbus.y, this.acerbus.width, this.acerbus.height);
    var exp = new Smoke(this.acerbus.x - 15, this.acerbus.y);
    this.chain.visible = false;
    this.shadow.visible = false;
    this.acerbus.x = 480;
    this.acerbus.y = 319;
    this.acerbus.frame = 0;
    this.acerbus.visible = true;
    game.time.events.add(2000, this.startRunaway, this);
  },

  startRunaway: function() {
    //var exp = new Explosion(game, this.acerbus.x, this.acerbus.y, this.acerbus.width, this.acerbus.height);
    var exp = new Smoke(this.acerbus.x - 15, this.acerbus.y);
    this.acerbus.visible = false;
    this.king.visible = false;
    this.portal.visible = true;
    this.portal.animations.play('main');
    game.time.events.add(1500, this.startCapture, this);
  },

  startCapture: function() {
    this.alysa.animations.play('run');
    var tween = game.add.tween(this.alysa);
    tween.to({x: 360}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function() {
      this.alysa.animations.stop();
      this.alysa.frame = 6;
      var tween2 = game.add.tween(this.alysa);
      var y = this.alysa.y;
      tween2.to({x: 420, y: y - 60}, 400, Phaser.Easing.Quadratic.None, true)
            .to({x: 440, y: y - 70}, 200, Phaser.Easing.Linear.None, true)
            .to({x: 470, y: y - 35}, 350, Phaser.Easing.Quadratic.None, true)
            .to({alpha: 0}, 400, Phaser.Easing.Bounce.None, true);
      tween2._lastChild.onComplete.add(function() {
        game.state.start('play');
      });
    }, this);
  },

  start: function() {
    game.state.start('play');
  }
};

var Dialog = function(facet, line1, line2) {
  this.facet = facet;
  this.line1 = line1;
  this.line2 = line2;
};
