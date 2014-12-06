var game = new Phaser.Game(640, 480, Phaser.CANVAS, 'haven', {preload:preload, create:create, update:update, render: render});
var map;
var layer;
var front_deco;
var back_deco;
var player;
var cursors;
var platforms;
var bullets;

var MaxShotDelay = 200;
var MaxBulletSpeed = 600;
/*
function Hero(x, y, key){
  var player = game.add.sprite(x, y, 'alysa');
  player.jumping = false;
  player.facing = 'right';
  player.canDoubleJump = false;
  player.doubleJumping = false;

  //player.animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7], 14, true);
  //player.animations.add('idle-right', [8], 10, false, false);
  //player.animations.add('idle-left', [9], 14, false, false);
  player.animations.add('ble', [10, 11, 12, 13, 14, 15, 16, 17], 14, true);

  player.move = function(cursors) {
    this.body.velocity.x = 0;

    if (this.body.onFloor()) {
      this.jumping = false;
      this.doubleJumping = false;
      this.canDoubleJump = false;
    }

    if (cursors.left.isDown) {
      console.log('left');
      this.animations.play('ble');
      this.facing = 'left';
      this.body.velocity.x = -200;
    } else if (cursors.right.isDown) {
      console.log('right');
      this.animations.play('right');
      this.facing = 'right';
      this.body.velocity.x = 200;
    } else {
      if (this.facing == 'left') {
        this.frame = 9;
        //this.animations.play('idle-left');
      } else {
        //this.animations.play('idle-right');
        this.frame = 8;
      }
      console.log('idle', this.frame);
    }

    if (cursors.up.isDown && this.body.onFloor()) {
      this.jumping = true;
      this.body.velocity.y = -800;
    }

    if (cursors.up.justReleased(50) && this.jumping && !this.doubleJumping) {
      this.canDoubleJump = true;
    }

    if (cursors.up.isDown && this.jumping && this.canDoubleJump) {
      this.doubleJumping = true;
      this.canDoubleJump = false;
      this.body.velocity.y = -500;
    }
  };

  return player;
}
*/

function preload() {
  game.load.tilemap('map', 'map.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.spritesheet('alysa', 'assets/alysa.png', 38, 52);
  game.load.image('wall', 'assets/box-blue.png');
  game.load.image('mario', 'assets/mario.png');
  game.load.image('bullet', 'assets/bullet.png');
}

function create() {
  game.stage.backgroundColor = '#3498db';
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.gravity.y = 300;

  bullets = game.add.group();
  bullets.enableBody = true;

  platforms = game.add.group();
  platforms.enableBody = true;

  map = game.add.tilemap('map');
  map.addTilesetImage('mario', 'mario');
  layer = map.createLayer('Platforms');
  back_deco = map.createLayer('Back Decorations');
  front_deco = map.createLayer('Front Decorations');
  map.setCollisionBetween(1, 28, true, 'Platforms');
  //layer.debug = true;
  layer.resizeWorld();

  //player = new Hero(250, 170);
  player = game.add.sprite(250, 170, 'alysa');
  player.jumping = false;
  player.facing = 'right';
  player.canShoot = true;
  player.canDoubleJump = false;
  player.doubleJumping = false;
  player.lastShotTime = 0;
  player.shooting = false;

  player.animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7], 16, true);
  player.animations.add('left',  [8, 9, 10, 11, 12, 13, 14, 15], 16, true);

  game.physics.arcade.enable(player);
  player.body.gravity.y = 1000;
  player.body.maxVelocity.y = 500;
  player.body.maxVelocity.x = 200;
  player.body.collideWorldBounds = true;
  player.body.setSize(22, 45, 8, 7);
  game.camera.follow(player);

  cursors = game.input.keyboard.createCursorKeys();
  game.world.bringToTop(bullets);
}

function update() {
  game.physics.arcade.collide(player, layer);
  game.physics.arcade.collide(bullets, layer, bulletCollision);

  if (player.body.onFloor()) {
    player.jumping = false;
    player.doubleJumping = false;
    player.canDoubleJump = false;
  }

  if (cursors.left.isDown) {
    player.facing = 'left';
    player.body.velocity.x = -200;
  } else if (cursors.right.isDown) {
    player.facing = 'right';
    player.body.velocity.x = 200;
  } else {
    player.body.velocity.x = 0;
  }

  //if (cursors.up.isDown && !player.jumping) {
  if (cursors.up.justPressed(50) && !player.jumping) {
    player.jumping = true;
    player.body.velocity.y = -800;
  }
  // Free fall
  if (player.body.velocity.y !== 0 && !player.jumping) {
    player.jumping = true;
    player.canDoubleJump = true;
  }

  if (cursors.up.justReleased(50) && player.jumping && !player.doubleJumping) {
    player.canDoubleJump = true;
  }

  if (cursors.up.isDown && player.jumping && player.canDoubleJump) {
    player.doubleJumping = true;
    player.canDoubleJump = false;
    player.body.velocity.y = -500;
  }

  if (game.input.keyboard.justPressed(Phaser.Keyboard.X) && !player.shooting && player.canShoot) {
    player.shooting = true;
    var bullet = bullets.create(player.body.x + (player.body.width / 2), player.body.y + (player.body.height / 2), 'bullet');
    bullet.body.allowGravity = false;
    bullet.bringToTop();
    if (player.facing === 'left') {
      bullet.body.velocity.x = -1 * MaxBulletSpeed;
    } else {
      bullet.body.velocity.x = MaxBulletSpeed;
    }
  }

  if (game.input.keyboard.justReleased(Phaser.Keyboard.X)) {
    player.shooting = false;
  }

  // Render
  if (player.jumping === true) {
    if (player.facing == 'left') {
      player.frame = 19;
    } else {
      player.frame = 18;
    }
  } else if (player.body.velocity.x !== 0 && player.body.velocity.y === 0) {
    if (player.facing == 'left') {
      player.animations.play('left');
    } else if (player.facing == 'right') {
      player.animations.play('right');
    }
  } else {
    player.animations.stop();
    if (player.facing == 'left') {
      player.frame = 17;
    } else {
      player.frame = 16;
    }
  }
}

function bulletCollision(bullet, platform) {
  bullet.kill();
}

function render () {
  //game.debug.text(game.time.physicsElapsed, 32, 32);
  //game.debug.body(player);
  //game.debug.bodyInfo(player, 16, 24);
}
