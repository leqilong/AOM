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
Hero.prototype.bounce = function(){
  const BOUNCE_SPEED = 200;
  this.body.velocity.y = - BOUNCE_SPEED;
};


function Spider(game, x, y){
  Phaser.Sprite.call(this, game, x, y, 'spider');
  //anchor
  this.anchor.set(0.5);
  //animation
  this.animations.add('crawl', [0,1,2], 8, true);
  this.animations.add('die', [0,4,0,4,0,4,3,3,3,3,3,3], 12);
  this.animations.play('crawl');

  //physic properties
  this.game.physics.enable(this);
  this.body.collideWorldBounds = true;
  this.body.velocity.x = Spider.SPEED;
}

Spider.SPEED = 100;

//inherit from Phaser.Sprite
Spider.prototype = Object.create(Phaser.Sprite.prototype);
Spider.prototype.constructor = Spider;
Spider.prototype.update = function(){
  //check against walls and reverse direction if neccessary
  if (this.body.touching.right || this.body.blocked.right){
    this.body.velocity.x = - Spider.SPEED; //turn left
  }else if (this.body.touching.left || this.body.blocked.left){
    this.body.velocity.x = Spider.SPEED; //turn right
  }
};
Spider.prototype.die = function(){
  this.body.enable = false;
  this.animations.play('die').onComplete.addOnce(function(){
    this.kill();
  }, this);
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
  game.load.spritesheet('spider', 'assets/spider.png', 42, 32);
  game.load.image('invisible-wall', 'assets/invisible_wall.png');
  //game.load.image('font:number', 'assets/numbers.png');
};

exports.create = function (game) {
  game.add.image(0, 0, 'jaime');
  this._loadLevel(game.cache.getJSON('level:0'));
  //this._createHud();
};

exports._loadLevel = function (data) {
  // create all the groups/layers that we need
  this.platforms = this.game.add.group();
  this.coins = this.game.add.group();
  this.spiders = this.game.add.group();
  this.enemyWalls = this.game.add.group();
  this.enemyWalls.visible = false;
  // spawn all platforms
  data.platforms.forEach(this._spawnPlatform, this);
  //spawn heroes and enemies
  this._spawnCharacters({hero: data.hero, spiders: data.spiders});
  //spawn important objects
  data.coins.forEach(this._spawnCoin, this);

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
  this._spawnEnemyWall(platform.x, platform.y, 'left');
  this._spawnEnemyWall(platform.x + sprite.width, platform.y, 'right');

};

exports._spawnCoin = function(coin){
  const sprite = this.coins.create(coin.x, coin.y, 'coin');
  sprite.anchor.set(0.5, 0.5);
  sprite.animations.add('rotate', [0,1,2,1], 6, true); //6 fps, looped
  sprite.animations.play('rotate');
  this.game.physics.enable(sprite);
  sprite.body.allowGravity = false;
};

exports._spawnCharacters = function (data){
  //spawn spiders
  data.spiders.forEach(function(spider){
    const sprite = new Spider(this.game, spider.x, spider.y);
    this.spiders.add(sprite);
  },this);
  //spawn hero
  this.hero = new Hero(this.game, data.hero.x, data.hero.y);
  this.game.add.existing(this.hero);
};

exports._spawnEnemyWall = function(x, y, side){
  const sprite = this.enemyWalls.create(x, y, 'invisible-wall');
  //anchor and y displacement
  sprite.anchor.set(side === 'left' ? 1 : 0, 1 );
  //physics properties
  this.game.physics.enable(sprite);
  sprite.body.immovable = true;
  sprite.body.allowGravity = false;

};

exports.update = function(){
  this._handleCollisions();
  this._handleInput();
  //this.coinFont.text = `x${this.coinPickupCount}`;
};

exports._handleCollisions = function () {
  this.game.physics.arcade.collide(this.spiders, this.platforms);
  this.game.physics.arcade.collide(this.spiders, this.enemyWalls);
  this.game.physics.arcade.collide(this.hero, this.platforms);
  this.game.physics.arcade.overlap(this.hero, this.coins, this._onHeroVsCoin, null, this);
  this.game.physics.arcade.overlap(this.hero, this.spiders, this._onHeroVsEnemy, null, this);
};

exports._onHeroVsCoin = function(hero, coin){
  coin.kill();
};

exports._onHeroVsEnemy = function(hero, enemy){
  if (hero.body.velocity.y > 0) {
    hero.bounce();
    enemy.die();
  }else {
    this.game.state.restart();
  }
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

// exports._createHud = function(){
//   const coinIcon = this.game.make.image(0,0,'icon:coin');
//   const coinScoreImg = this.game.make.image(coinIcon.x + coinIcon.width,
//     coinIcon.height/2, this.coinFont);
//   coinScoreImg.anchor.set(0, 0.5);
//   const NUMBERS_STR = '0123456789X';
//   this.coinFont = this.game.add.retroFont('font:numbers', 20, 26,
//     NUMBERS_STR, 6);
//
//   this.hud = this.game.add.group();
//   this.hud.add(coinIcon);
//   this.hud.position.set(10,10);
//   this.hud.add(coinScoreImg);
// };
