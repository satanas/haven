'use strict';

var Item = function(type, x, y, fixed, dissapear) {
  Phaser.Sprite.call(this, game, x, y, type, 0);

  game.physics.arcade.enable(this);
  this.body.allowGravity = true;
  this.body.velocity.y = 50;
  this.fixed = fixed || false;
  this.dissapear = dissapear || false;
  this.lifeTime = 10000;
  this.alertTime = 4000;
  this.blinkDelay = 100;
  this.blinking = false;
  this.itemType = type;
  groups.items.add(this);
};

Item.prototype = Object.create(Phaser.Sprite.prototype);
Item.prototype.constructor = Item;

Item.prototype.update = function() {
  game.physics.arcade.collide(this, groups.tiles);
  this.checkLifetime();
};

Item.prototype.checkLifetime = function() {
  if (this.dissapear) {
    this.lifeTime -= game.time.elapsed;
    if (this.lifeTime <= this.alertTime && !this.blinking) {
      this.blinking = true;
      this.timer = game.time.events.loop(this.blinkDelay, this.blink, this);
    }
  }
};

Item.prototype.blink = function() {
  this.visible = !this.visible;
  if (this.lifeTime <= 0) {
    game.time.events.remove(this.timer);
    this.destroy();
  }
};

var Diamond = function(x, y, fixed, dissapear) {
  Item.call(this, itemTypes.DIAMOND, x, y, fixed, dissapear);
  this.body.setSize(16, 12, 8, 10);
  groups.items.add(this);
};

Diamond.prototype = Object.create(Item.prototype);
Diamond.prototype.constructor = Diamond;

var ExtraLife = function(x, y) {
  Item.call(this, itemTypes.EXTRALIFE, x, y, true, false);
  this.body.setSize(28, 24, 2, 4);
  groups.items.add(this);
};

ExtraLife.prototype = Object.create(Item.prototype);
ExtraLife.prototype.constructor = ExtraLife;

var Heart = function(x, y) {
  Item.call(this, itemTypes.HEART, x, y, false, true);
  this.body.setSize(16, 16, 0, 0);
  this.frame = 0;
};

Heart.prototype = Object.create(Item.prototype);
Heart.prototype.constructor = Heart;
