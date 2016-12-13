var TopDownGame = TopDownGame || {};

//loading the game assets
TopDownGame.Preload = function(){};

TopDownGame.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);

    this.load.setPreloadSprite(this.preloadBar);

    //load game assets
    this.load.tilemap('level1', 'assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('gameTiles', 'assets/images/tiles.png');
    this.load.image('greencup', 'assets/images/greencup.png');
    this.load.image('bluecup', 'assets/images/bluecup.png');
    this.load.image('player', 'assets/images/player.png');
    this.load.image('browndoor', 'assets/images/browndoor.png');
    this.load.image('thisgirl', 'assets/images/thisgirl.png');
    this.load.image('thisboy', 'assets/images/thisboy.png');
    this.load.image('textbox', 'assets/images/textbox.jpg');
    this.load.image('monster', 'assets/images/monster.png');
    this.load.image('boss', 'assets/images/boss.png');
    this.load.image('box', 'assets/images/box.png');
  },
    
  create: function() {
    this.state.start('Game');
  }
};