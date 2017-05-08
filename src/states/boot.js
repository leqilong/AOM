'use strict';

exports.preload = function (game) {
  game.physics.startSystem(Phaser.Physics.ARCADE);
}

exports.create = function (game) {
  game.state.start('preload');
}
