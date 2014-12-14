'use strict';

function Game() {}

Game.prototype = {
  create: function() {
    console.log('game');
    this.map = null;
    this.player = null;

    this.game.stage.backgroundColor = '#3498db';
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 300;

    this.bg1 = game.add.tileSprite(0, 0, 640, 480, 'bg');
    this.bg1.fixedToCamera = true;
    this.bullets = this.game.add.group();
    this.bullets.enableBody = true;

    this.platforms = this.game.add.group();
    this.platforms.enableBody = true;

    this.map = this.game.add.tilemap('map');
    this.map.addTilesetImage('MARIO', 'mario');
    this.layer = this.map.createLayer('Platforms');
    this.back_deco = this.map.createLayer('Back Decorations');
    this.front_deco = this.map.createLayer('Front Decorations');
    this.map.setCollisionBetween(1, 120, true, 'Platforms');
    //layer.debug = true;
    this.layer.resizeWorld();

    //player = new Hero(250, 170);
    this.player = this.game.add.sprite(250, 170, 'alysa');
    this.player.jumping = false;
    this.player.facing = 'right';
    this.player.canShoot = true;
    this.player.canDoubleJump = false;
    this.player.doubleJumping = false;
    this.player.lastShotTime = 0;
    this.player.shooting = false;
    this.player.death = false;

    this.player.animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7], 12, true);
    this.player.animations.add('left',  [8, 9, 10, 11, 12, 13, 14, 15], 12, true);

    this.game.physics.arcade.enable(this.player);
    this.player.body.gravity.y = 1000;
    this.player.body.maxVelocity.y = 500;
    this.player.body.maxVelocity.x = 200;
    this.player.body.setSize(22, 45, 8, 7);
    this.game.camera.follow(this.player);

    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.game.world.bringToTop(this.bullets);

    this.gumbon = new Gumbon(this.game, 100, 100, 0);
    this.game.add.existing(this.gumbon);
  },

  update: function() {
    if (this.player.death){
      console.log('death effect');
      this.player.body.enable = false;
      return;
    }
    this.bg1.tilePosition.x -= 0.5;

    this.game.physics.arcade.collide(this.player, this.layer);
    this.game.physics.arcade.collide(this.gumbon, this.layer);
    this.game.physics.arcade.collide(this.bullets, this.layer, this.bulletCollision);

    if (this.player.body.onFloor()) {
      this.player.jumping = false;
      this.player.doubleJumping = false;
      this.player.canDoubleJump = false;
    }

    if (this.cursors.left.isDown) {
      this.player.facing = 'left';
      this.player.body.velocity.x = -200;
    } else if (this.cursors.right.isDown) {
      this.player.facing = 'right';
      this.player.body.velocity.x = 200;
    } else {
      this.player.body.velocity.x = 0;
    }

    //if (this.cursors.up.isDown && !this.player.jumping) {
    if (this.cursors.up.justPressed(50) && !this.player.jumping) {
      this.player.jumping = true;
      this.player.body.velocity.y = -800;
    }
    // Free fall
    if (this.player.body.velocity.y !== 0 && !this.player.jumping) {
      this.player.jumping = true;
      this.player.canDoubleJump = true;
    }

    if (this.cursors.up.justReleased(50) && this.player.jumping && !this.player.doubleJumping) {
      this.player.canDoubleJump = true;
    }

    if (this.cursors.up.isDown && this.player.jumping && this.player.canDoubleJump) {
      this.player.doubleJumping = true;
      this.player.canDoubleJump = false;
      this.player.body.velocity.y = -500;
    }

    if (this.game.input.keyboard.justPressed(Phaser.Keyboard.X) && !this.player.shooting && this.player.canShoot) {
      this.player.shooting = true;
      var bullet = this.bullets.create(this.player.body.x + (this.player.body.width / 2), this.player.body.y + (this.player.body.height / 2), 'bullet');
      bullet.body.allowGravity = false;
      bullet.bringToTop();
      if (this.player.facing === 'left') {
        bullet.body.velocity.x = -1 * this.game.global.maxBulletSpeed;
      } else {
        bullet.body.velocity.x = this.game.global.maxBulletSpeed;
      }
    }

    if (this.game.input.keyboard.justReleased(Phaser.Keyboard.X)) {
      this.player.shooting = false;
    }

    // Render
    if (this.player.jumping === true) {
      if (this.player.facing == 'left') {
        this.player.frame = 19;
      } else {
        this.player.frame = 18;
      }
    } else if (this.player.body.velocity.x !== 0 && this.player.body.velocity.y === 0) {
      if (this.player.facing == 'left') {
        this.player.animations.play('left');
      } else if (this.player.facing == 'right') {
        this.player.animations.play('right');
      }
    } else {
      this.player.animations.stop();
      if (this.player.facing == 'left') {
        this.player.frame = 17;
      } else {
        this.player.frame = 16;
      }
    }

    // Collide with bounds. We only detect the side bounds
    if (this.player.x >= this.game.world.width - this.player.width) {
      this.player.x = this.game.world.width - this.player.width;
    }
    if (this.player.x <= 0) {
      this.player.x = 0;
    }


    // Detect death by falling
    if (this.player.y > this.game.world.height && !this.player.death) {
      var self = this;
      this.player.death = true;
      this.game.plugin.fadeOut(0x000, 750, 0, function() {
        self.game.state.start('gameover');
      });
    }

    //if (this.player.x > 500) {
    //  this.player.death = true;
    //  this.game.plugin.fadeOut(0x000, 2000);
    //}
  },

  render: function() {
    //game.debug.text(game.time.physicsElapsed, 32, 32);
    //this.game.debug.body(this.gumbon);
    //game.debug.bodyInfo(player, 16, 24);
  },

  bulletCollision: function(bullet, platform) {
    bullet.kill();
  }
};
