'use strict';

var Hero = require('../prefabs/hero');
var Spider = require('../prefabs/spider');

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

exports.create = function (game) {
  this._loadLevel(game.cache.getJSON('level:0'), game.cache.getJSON('results'));
  this._createHud();
};

exports.update = function(){
  this._handleCollisions();
  this._handleInput();
  //this.coinFont.text = `x${this.coinPickupCount}`;
};

this._loadLevel = function (data, resultsData) {
  // create all the groups/layers that we need
  this.platforms = this.game.add.group();
  this.coins = this.game.add.group();
  this.spiders = this.game.add.group();
  this.enemyWalls = this.game.add.group();
  this.enemyWalls.visible = false;
  // spawn all platforms
  this._spawnPlatform(resultsData, this);
  //spawn heroes and enemies
  this._spawnCharacters({hero: data.hero, spiders: data.spiders});
  //spawn important objects
  data.coins.forEach(this._spawnCoin, this);

  // enable gravity
  const GRAVITY = 1200;
  this.game.physics.arcade.gravity.y = GRAVITY;
};

this._spawnPlatform = function (results) {
  //this.game.add.sprite(platform.x, platform.y, platform.image);
  var bmd;
  bmd = this.game.add.bitmapData(800, 450);

  results.forEach(function(index){
    var ctx = bmd.context;
    //bmd.clear();
    ctx.fillStyle = '#2E8B57';
    ctx.fillRect(index*40 ,0, 30, 100);
    // var dataURL = bmd.canvas.toDataURL();
    // this.game.load.spritesheet('myDynamicSpritesheet', dataURL, 30, 100);

    // const sprite = this.platforms.create(index*40 ,0, 'myDynamicSpritesheet');

    // this.game.physics.enable(sprite);
    // sprite.body.allowGravity = false;
    // sprite.body.immovable = true;

  });
  // this._spawnEnemyWall(index*40, platform.west, 'left');
  // this._spawnEnemyWall(index*40 + 30, platform.west, 'right');
};

this._spawnCoin = function(coin){
  const sprite = this.coins.create(coin.x, coin.y, 'coin');
  sprite.anchor.set(0.5, 0.5);
  sprite.animations.add('rotate', [0,1,2,1], 6, true); //6 fps, looped
  sprite.animations.play('rotate');
  this.game.physics.enable(sprite);
  sprite.body.allowGravity = false;
};

this._spawnCharacters = function (data){
  //spawn spiders
  data.spiders.forEach(function(spider){
    const sprite = new Spider(this.game, spider.x, spider.y);
    this.spiders.add(sprite);
  },this);
  //spawn hero
  this.hero = new Hero(this.game, data.hero.x, data.hero.y);
  this.game.add.existing(this.hero);
};

this._spawnEnemyWall = function(x, y, side){
  const sprite = this.enemyWalls.create(x, y, 'invisible-wall');
  //anchor and y displacement
  sprite.anchor.set(side === 'left' ? 1 : 0, 1 );
  //physics properties
  this.game.physics.enable(sprite);
  sprite.body.immovable = true;
  sprite.body.allowGravity = false;
};

this._handleCollisions = function () {
  this.game.physics.arcade.collide(this.spiders, this.platforms);
  this.game.physics.arcade.collide(this.spiders, this.enemyWalls);
  this.game.physics.arcade.collide(this.hero, this.platforms);
  this.game.physics.arcade.overlap(this.hero, this.coins, this._onHeroVsCoin, null, this);
  this.game.physics.arcade.overlap(this.hero, this.spiders, this._onHeroVsEnemy, null, this);
};

this._onHeroVsCoin = function(hero, coin){
  coin.kill();
};

this._onHeroVsEnemy = function(hero, enemy){
  if (hero.body.velocity.y > 0) {
    hero.bounce();
    enemy.die();
  }else {
    this.game.state.restart();
  }
};

this._handleInput = function(){
  if (this.keys.left.isDown){
    this.hero.move(-1);
  }else if (this.keys.right.isDown){
    this.hero.move(1);
  }else{
    this.hero.move(0);
  }
};

this._createHud = function(){
  const coinIcon = this.game.make.image(0,0,'icon:coin');
  const coinScoreImg = this.game.make.image(coinIcon.x + coinIcon.width,
    coinIcon.height/2, this.coinFont);
  coinScoreImg.anchor.set(0, 0.5);
  const NUMBERS_STR = '0123456789X';
  this.coinFont = this.game.add.retroFont('font:numbers', 20, 26,
    NUMBERS_STR, 6);

  this.hud = this.game.add.group();
  this.hud.add(coinIcon);
  this.hud.position.set(10,10);
  this.hud.add(coinScoreImg);
};
