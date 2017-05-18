'use strict';

var boot = require('./states/boot.js');
var preload = require('./states/preload.js');

var game = new Phaser.Game(800, 450, Phaser.AUTO, 'content');

game.state.add('boot', boot);
game.state.add('preload', preload);

game.state.start('boot');

//game.state.start('play');
