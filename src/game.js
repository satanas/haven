'use strict';

var game = new Phaser.Game(640, 480, Phaser.CANVAS, 'game');
game.global = {
  diamonds: 0,
  level: 1,
  lives: 3,
  drop: 0.4,
  lastCheckpoint: null,
  causeOfDeath: null,
  maxHeroHealth: 4,
  maxBossHealth: 15,
  killedEnemies: 0,
  diamondsToLife: 100,
  previousLevel: 0,
  movingToNextLevel: false,
  items: []
}
var debug = false;
var groups = {};

game.state.add('boot', Boot);
game.state.add('preload', Preload);
game.state.add('menu', Menu);
game.state.add('disclaimer', Disclaimer);
game.state.add('intro', Intro);
game.state.add('play', Play);
game.state.add('gameover', GameOver);
game.state.add('death', Death);
game.state.add('ending', Ending);

game.state.start('boot');
