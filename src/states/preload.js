'use strict';

function Hero(game, x, y) {
    // call Phaser.Sprite constructor
  Phaser.Sprite.call(this, game, x, y, 'hero');
  this.anchor.set(0.2,1);
  this.game.physics.enable(this);
  this.body.collideWorldBounds = true;
}

// inherit from Phaser.Sprite
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;
Hero.prototype.move = function(direction){
  //this.x += direction *2.5; //2.5 pixels each frame
  const SPEED = 200;
  this.body.velocity.x = direction * SPEED;
};
Hero.prototype.jump = function(){
  const JUMP_SPEED = 600;
  const canJump = this.body.touching.down;

  if(canJump){
    this.body.velocity.y = - JUMP_SPEED;
  }
  return canJump;
};

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
};

exports.preload = function (game) {
  game.load.json('level:0', 'data/level0.json');
  game.load.image('tile', 'assets/tiles/tile.png');
  game.load.image('hero', 'assets/goat.png');
  game.load.spritesheet('coin', 'assets/coin_animated.png', 22, 22);
};

exports.create = function (game) {
  game.add.image(0, 0, 'jaime');
  this._loadLevel(game.cache.getJSON('level:0'));
};

exports._loadLevel = function (data) {
  // create all the groups/layers that we need
  this.platforms = this.game.add.group();

  // spawn all platforms
  data.platforms.forEach(this._spawnPlatform, this);
  //spawn heroes and enemies
  this._spawnCharacters({hero: data.hero});

  // enable gravity
  const GRAVITY = 1200;
  this.game.physics.arcade.gravity.y = GRAVITY;
};

exports._spawnPlatform = function (platform) {
  //this.game.add.sprite(platform.x, platform.y, platform.image);
  const sprite = this.platforms.create(
        platform.x, platform.y, platform.image);
  this.game.physics.enable(sprite);
  sprite.body.allowGravity = false;
  sprite.body.immovable = true;

};

exports._spawnCharacters = function (data){
  //spawn hero
  this.hero = new Hero(this.game, data.hero.x, data.hero.y);
  this.game.add.existing(this.hero);
};

exports.update = function(){
  this._handleCollisions();
  this._handleInput();
};

exports._handleCollisions = function () {
  this.game.physics.arcade.collide(this.hero, this.platforms);
};
exports._handleInput = function(){
  if (this.keys.left.isDown){
    this.hero.move(-1);
  }else if (this.keys.right.isDown){
    this.hero.move(1);
  }else{
    this.hero.move(0);
  }
};
