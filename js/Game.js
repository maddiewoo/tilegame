var TopDownGame = TopDownGame || {};

//title screen
TopDownGame.Game = function(){};

TopDownGame.Game.prototype = {
  create: function() {
    this.map = this.game.add.tilemap('level1');

    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
    this.map.addTilesetImage('tiles', 'gameTiles');

    //create layer
    this.backgroundlayer = this.map.createLayer('backgroundLayer');
    this.blockedLayer = this.map.createLayer('blockedLayer');

    //collision on blockedLayer
    this.map.setCollisionBetween(1, 2000, true, 'blockedLayer');

    //resizes the game world to match the layer dimensions
    this.backgroundlayer.resizeWorld();

    this.createItems();
    this.createDoors();
    this.createMonsters();

    //create player
    var result = this.findObjectsByType('playerStart', this.map, 'objectsLayer')
    this.player = this.game.add.sprite(result[0].x, result[0].y, 'player');    
      
    this.game.physics.arcade.enable(this.player);
    this.player.body.collideWorldBounds = true
      
    result = this.findObjectsByType('NPC', this.map, 'objectsLayer')
    this.thisgirl = this.game.add.sprite(result[0].x, result[0].y, 'thisgirl');
      
    this.game.physics.arcade.enable(this.thisgirl);
      
    this.thisgirl.body.immovable = true;
      
    //score
      this.score = 0;
   
 this.scoreText = this.game.add.text(5, 5, 'Score: 0', { fontSize: '32px', fill: '#fff' });
      this.scoreText.fixedToCamera = true;
    
      // creating thisboy
    this.thisboy = this.game.add.sprite(result[1].x, result[1].y, 'thisboy');
      
    this.game.physics.arcade.enable(this.thisboy);
      
    this.thisboy.body.immovable = true;
      
    this.startingx = this.player.x
    this.startingy = this.player.y
      
      //made this boy movable
    var tween = this.game.add.tween(this.thisboy);
    
     tween.to({ x: [this.thisboy.x+50, this.thisboy.x]}, 3000, "Linear");
      tween.loop(true);
      tween.start();
    
    
      

    //the camera will follow the player in the world
    this.game.camera.follow(this.player);

    //move player with cursor keys
    this.cursors = this.game.input.keyboard.createCursorKeys();

  },
  createItems: function() {
    //create items
    this.items = this.game.add.group();
    this.items.enableBody = true;
    var item;    
    result = this.findObjectsByType('item', this.map, 'objectsLayer');
    result.forEach(function(element){
      this.createFromTiledObject(element, this.items);
    }, this);
      
    
  },
  createDoors: function() {
    //create doors
    this.doors = this.game.add.group();
    this.doors.enableBody = true;
    result = this.findObjectsByType('door', this.map, 'objectsLayer');
    result.forEach(function(element){
      this.createFromTiledObject(element, this.doors);
    }, this);
      
      //teleport from door1 to door2
      this.teleportx = result[1].x 
      this.teleporty = result[1].y;
  },
    
 createMonsters: function() {
    
    this.monsters = this.game.add.group();
    this.monsters.enableBody = true;
    result = this.findObjectsByType('monster', this.map, 'objectsLayer');
    result.forEach(function(element){
        
        
        
      var monster = this.createFromTiledObject(element, this.monsters);
        
    
        var tween = this.game.add.tween(monster);
    
     tween.to({ x: [monster.x+50, monster.x]}, 2500, "Linear");
      tween.loop(true);
      tween.start();
        
    }, this);
     
     
 },
 
     createNPC: function() {
    //create NPC
    this.NPC = this.game.add.group();
    this.NPC.enableBody = true;
    result = this.findObjectsByType('NPC', this.map, 'objectsLayer');
     result.forEach(function(element){
      this.createFromTiledObject(element, this.NPC);
    }, this);
  },
  //find objects in a Tiled layer that containt a property called "type" equal to a certain value
  findObjectsByType: function(type, map, layer) {
    var result = new Array();
    map.objects[layer].forEach(function(element){
      if(element.properties.type === type) {
        //Phaser uses top left, Tiled bottom left so we have to adjust
        //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
        //so they might not be placed in the exact position as in Tiled
        element.y -= map.tileHeight;
        result.push(element);
      }      
    });
    return result;
  },
  //create a sprite from an object
  createFromTiledObject: function(element, group) {
    var sprite = group.create(element.x, element.y, element.properties.sprite);
      //copy all properties to the sprite
      Object.keys(element.properties).forEach(function(key){
        sprite[key] = element.properties[key];
      });
      return sprite;
  },
  update: function() {
    //collision
    this.game.physics.arcade.collide(this.player, this.blockedLayer);
    this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);
    this.game.physics.arcade.overlap(this.player, this.doors, this.enterDoor, null, this);
    this.game.physics.arcade.collide(this.player, this.thisgirl, this.talk1, null, this);
    this.game.physics.arcade.collide(this.player, this.thisboy, this.talk2, null, this);
    this.game.physics.arcade.collide(this.player, this.monsters, this.teleport, null, this);

    //player movement
    
    this.player.body.velocity.x = 0;

    if(this.cursors.up.isDown) {
      if(this.player.body.velocity.y == 0)
      this.player.body.velocity.y -= 50;
    }
    else if(this.cursors.down.isDown) {
      if(this.player.body.velocity.y == 0)
      this.player.body.velocity.y += 50;
    }
    else {
      this.player.body.velocity.y = 0;
    }
    if(this.cursors.left.isDown) {
      this.player.body.velocity.x -= 50;
    }
    else if(this.cursors.right.isDown) {
      this.player.body.velocity.x += 50;
    }
     if (this.textbox != null){
    var deltax = (this.talkx - this.player.x);
    var deltay = (this.talky - this.player.y);
    var lady = Math.sqrt (deltax * deltax + deltay * deltay);
    if (lady > 20){
        this.textbox.destroy();
        this.textbox = null;
        console.log (lady);
    }
   }
  },
  collect: function(player, collectable) {
    console.log('yummy!');
       
      this.score += 10;
    this.scoreText.text = 'Score: ' + this.score;
  
if(this.score>120)
   {
      this.showDialog("You Win");
   }
      

    //remove sprite
    collectable.destroy();
  },
  enterDoor: function(player, door) {
    
      if (typeof door.targetTilemap == 'undefined' ||door.targetTilemap == null) {
          console.log("Do nothing");
          return;
      }
    
      this.player.x = this.teleportx
    this.player.y = this.teleporty
    
  },
  talk1: function(player, NPC) {
      this.showDialog("Find Boy")

      this.textbox.visible = true;

      this.talkx = NPC.x;
      this.talky = NPC.y; 
  },
  talk2: function(player, NPC) {
      this.showDialog("Green brick")
      
      this.talkx = NPC.x;
      this.talky = NPC.y; 
  },
    teleport: function(player, NPC) { console.log("this returns to starting spot" +this.startingx        +this.startingy);
        this.player.x = this.startingx 
        this.player.y = this.startingy
            
    },
    showDialog: function(message){
        
      if (this.textbox != null && this.textbox.message == message) {
          return;
      }
      
      var container = this.game.add.sprite (90, 90, 'textbox'); 
      
      container.anchor.x = 0.5;
      container.anchor.y = 0;
      
      container.scale.setTo (0.6,0.4);
      
      container.x = this.camera.width / 2;
      container.y = this.camera.height - container.height * 1.1;
      
      container.fixedToCamera = true;
      
      container.alpha = 0.8;
      
      var text = this.game.add.text(0, 0, message, { font: 'bold 45px Arial', fill: '#00ff00' });
      text.wordWrapWidth = container.width * 1;
      text.wordWrap = true;
      
      text.anchor.set(0.5, 0);
      
      container.addChild(text);
      
      container.message = message;
      
      this.textbox = container;
    },
};
