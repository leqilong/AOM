var game = new Phaser.Game(600, 450, Phaser.AUTO, 'content');

game.state.add('boot', boot);

game.state.start('boot');
