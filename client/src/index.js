'use strict';

var boot = require('./states/boot');
var preload = require('./states/preload');
var gameplay = require('./states/gameplay');

var game = new Phaser.Game(800, 450, Phaser.AUTO, 'content');

game.state.add('boot', boot);
game.state.add('preload', preload);
game.state.add('gameplay', gameplay);

game.state.start('boot');
