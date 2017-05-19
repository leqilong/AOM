'use strict';

exports.preload = function(game) {
  game.load.json('level:0', 'data/level0.json');
  game.load.json('results', 'data/results.json');
  // game.load.image('tile', 'assets/tiles/tile.png');
  game.load.image('hero', 'assets/goat.png');
  game.load.spritesheet('coin', 'assets/coin_animated.png', 22, 22);
  game.load.spritesheet('spider', 'assets/spider.png', 42, 32);
  game.load.image('invisible-wall', 'assets/invisible_wall.png');
  game.load.image('icon:coin', 'assets/coin_icon.png');
  game.load.image('font:numbers', 'assets/numbers.png');

  // var bmd;
  // bmd = this.game.add.bitmapData(800, 450);
  //
  // var ctx = bmd.context;
  // bmd.clear();
  // ctx.fillStyle = '#2E8B57';
  // ctx.fillRect(0 ,0, 30, 100);
  // var dataURL = bmd.canvas.toDataURL();
  // game.load.spritesheet('myDynamicSpritesheet', dataURL, 30, 100);
};

exports.create = function(game) {
  var bmd;
  bmd = this.game.add.bitmapData(800, 450);
  var results = game.cache.getJSON('results');

  results.forEach(function(index){
    var ctx = bmd.context;
    bmd.clear();
    ctx.fillStyle = '#2E8B57';
    ctx.fillRect(index*40 ,300, 30, 100);
    var dataURL = bmd.canvas.toDataURL();
    //game.load.spritesheet('myDynamicSpritesheet', dataURL, 30, 100);
    game.cache.addSpriteSheet('myDynamicSpritesheet', dataURL, 30, 100);
    //game.load.start();
    //const sprite = platforms.create(index*40 ,300, 'myDynamicSpritesheet');

    // game.physics.enable(sprite);
    // sprite.body.allowGravity = false;
    // sprite.body.immovable = true;
  });
  game.state.start('gameplay');
};
