'use strict';

exports.init = function(){
  this.game.renderer.renderSession.roundPixels = true;
  this.keys = this.game.input.keyboard.addKeys({
    left: Phaser.KeyCode.LEFT,
    right: Phaser.KeyCode.RIGHT,
    up: Phaser.KeyCode.UP
  });
  this.keys.up.onDown.add(function(){
    this.hero.jump();
  }, this);
  this.coinPickupCount = 0;
};

exports.preload = function (game) {
  //game.stage.backgroundColor = '#ffffff';
  game.load.json('level:0', 'data/level0.json');
  game.load.json('results', 'data/results.json');
  //game.load.image('tile', 'assets/tiles/tile.png');
  game.load.image('hero', 'assets/goat.png');
  game.load.spritesheet('coin', 'assets/coin_animated.png', 22, 22);
  game.load.spritesheet('spider', 'assets/spider.png', 42, 32);
  game.load.image('invisible-wall', 'assets/invisible_wall.png');
  game.load.image('icon:coin', 'assets/coin_icon.png');
  game.load.image('font:numbers', 'assets/numbers.png');
};

exports.create = function (game) {
  game.state.start('gamestate');
};
