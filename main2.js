'use strict';

var game = new Phaser.Game(640, 480, Phaser.CANVAS, 'game');
game.global = {
  sceneDelay: 200,
  maxShotDelay: 200,
  maxBulletSpeed: 600
}
//game.stage.backgroundColor = '#fff';

game.state.add('boot', Boot);
game.state.add('intro', Intro);
game.state.add('preload', Preload);
game.state.add('menu', Menu);
game.state.add('game', Game);

game.state.start('boot');
