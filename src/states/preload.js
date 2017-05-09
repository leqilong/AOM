'use strict';

function Hero(game, x, y) {
    // call Phaser.Sprite constructor
  Phaser.Sprite.call(this, game, x, y, 'hero');
  this.anchor.set(0.5,0.5);
}

// inherit from Phaser.Sprite
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;


exports.preload = function (game) {
  game.load.json('level:0', 'data/level0.json');
  game.load.image('tile', 'assets/tiles/tile.png');
  game.load.image('hero', 'assets/goat.png');
};

exports.create = function (game) {
  game.add.image(0, 0, 'jaime');
  this._loadLevel(game.cache.getJSON('level:0'));
};

exports._loadLevel = function (data) {
  // spawn all platforms
  data.platforms.forEach(this._spawnPlatform, this);
  //spawn heroes and enemies
  this._spawnCharacters({hero: data.hero});
};

exports._spawnPlatform = function (platform) {
  this.game.add.sprite(platform.x, platform.y, platform.image);
};

exports._spawnCharacters = function (data){
  //spawn hero
  this.hero = new Hero(this.game, data.hero.x, data.hero.y);
  this.game.add.existing(this.hero);
};
