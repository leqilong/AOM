'use strict';

exports.preload = function (game) {
  this.game.load.image('jaime', 'assets/jaime.png');
};

exports.create = function (game) {
  this.game.add.image(0, 0, 'jaime');
};
