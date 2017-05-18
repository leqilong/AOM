'use strict';

var boot = require('./states/boot.js');
var preload = require('./states/preload.js');
var menu = require('./states/menu.js');
var gamestate = require('./states/gamestate.js');

var game = new Phaser.Game(800, 450, Phaser.AUTO, 'content');

game.state.add('boot', boot);
game.state.add('preload', preload);
game.state.add('menu', menu);
game.state.add('gamestate', gamestate);

game.state.start('boot');
