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
module.exports = Hero.prototype.constructor = Hero;
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
