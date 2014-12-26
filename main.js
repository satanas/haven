'use strict';

var game = new Phaser.Game(640, 480, Phaser.CANVAS, 'game');
game.global = {
  sceneDelay: 200,
  diamonds: 0,
  lives: 3
}
var groups = {};

//game.stage.backgroundColor = '#fff';

game.state.add('boot', Boot);
game.state.add('intro', Intro);
game.state.add('preload', Preload);
game.state.add('menu', Menu);
game.state.add('game', Game);
game.state.add('gameover', GameOver);

game.state.start('boot');
