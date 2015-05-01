'use strict';

var Menu = {
  create: function() {
    this.scrolling = true;
    this.lightning = false;
    this.lightningDelay = 60;
    this.lightningTime = 0;
    this.lightningIndex = 1;
    game.stage.backgroundColor = '#000';
    game.world.setBounds(0, 0, 1442, 480);

    this.bgmSound = game.add.audio('bgm-menu', 1, true);
    this.selectSound = game.add.audio('select');

    this.background1 = game.add.image(0, 0, 'intro-bg1');
    this.background2 = game.add.image(0, 0, 'intro-bg2');
    this.background2.visible = false;
    this.background3 = game.add.image(0, 0, 'intro-bg3');
    this.background3.visible = false;
    this.clouds = game.add.tileSprite(0, -100, 640, 480, 'clouds');
    this.castle = game.add.image(600, 0, 'castle');
    this.chain = game.add.image(80, 0, 'chain');
    this.chain.visible = false;
    this.mountain = game.add.image(-550, 0, 'mountain');
    this.alysa = game.add.sprite(-120, 308, 'alysa', 0);
    this.clouds.fixedToCamera = true;

    this.castleTween = game.add.tween(this.castle);
    this.castleTween.to({x: 180}, 12000, Phaser.Easing.Linear.None, true);
    this.castleSwayTween = game.add.tween(this.castle);
    this.castleSwayTween.to({y: 5}, 3000, Phaser.Easing.Bounce.None, true).to({y: -5}, 3000, Phaser.Easing.Bounce.None, true).loop(true);
    this.mountainTween = game.add.tween(this.mountain);
    this.mountainTween.to({x: -275}, 10000, Phaser.Easing.Linear.None, true, 2000);
    this.mountainTween.onComplete.addOnce(this.show, this)
    this.alysaTween = game.add.tween(this.alysa);
    this.alysaTween.to({x: 162}, 10000, Phaser.Easing.Linear.None, true, 2000);

    var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    enterKey.onDown.add(this.start, this);

    game.sound.stopAll();
    this.bgmSound.play();
  },

  start: function() {
    if (this.scrolling) {
      this.castleTween.stop();
      this.mountainTween.stop();
      this.alysaTween.stop();
      this.castle.x = 180;
      this.mountain.x = -275;
      this.alysa.x = 162;
      this.show();
    } else {
      this.timer.stop();
      this.selectSound.play();
      game.state.start('disclaimer');
    }
  },

  show: function() {
    this.scrolling = false;
    bitmapTextCentered(game.height - 48, 'press_start', 'Press ENTER to start', 12);
    //bitmapTextCentered(330, 'press_start', 'Press ENTER to start', 12);
    //bitmapTextCentered(130, 'press_start', 'Press ENTER to start', 12);
    bitmapTextCentered(game.height - 14, 'press_start', 'Created by LudusPactum - @luduspactum', 9);
    bitmapTextCentered(35, 'press_start', 'Haven', 50);
    bitmapTextCentered(90, 'press_start', 'A story between worlds', 11);
    this.startLightning();
    this.timer = game.time.events.loop(7000, this.startLightning, this);
  },

  startLightning: function() {
    this.lightning = true;
  },

  update: function() {
    this.clouds.tilePosition.x += 0.5;

    if (this.lightning) {
      this.lightningTime += game.time.elapsed;

      if (this.lightningTime >= this.lightningDelay) {
        this.lightningIndex += 1;
        this.lightningTime = 0;

        if (this.lightningIndex === 6) {
          this.background3.visible = false;
          this.background1.visible = true;
          this.lightningIndex = 0;
          this.lightning = false;
          if (!this.chain.visible) this.chain.visible = true;
        } else if (this.lightningIndex === 2 || this.lightningIndex === 4) {
          this.background1.visible = false;
          this.background2.visible = true;
          this.background3.visible = false;
        } else if (this.lightningIndex === 3 || this.lightningIndex === 5) {
          this.background1.visible = false;
          this.background2.visible = false;
          this.background3.visible = true;
          //this.lightningIndex = 0;
        }
      }
    }
  }
};

