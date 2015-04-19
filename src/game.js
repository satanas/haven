'use strict';

var game = new Phaser.Game(640, 480, Phaser.CANVAS, 'game');
game.global = {
  sceneDelay: 200,
  diamonds: 0,
  lives: 3,
  lastCheckpoint: null,
  causeOfDeath: null,
  maxHeroHealth: 4,
  killedEnemies: 0,
  items: []
}
var debug = false;
var groups = {};

game.state.add('boot', Boot);
game.state.add('intro', Intro);
game.state.add('preload', Preload);
game.state.add('menu', Menu);
game.state.add('play', Play);
game.state.add('gameover', GameOver);
game.state.add('death', Death);
game.state.add('ending', Ending);

game.state.start('boot');
