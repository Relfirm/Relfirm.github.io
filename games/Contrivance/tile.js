Tile = function(x, y, id) {
  this.x = x;
  this.y = y;
  this.width = game.scale;
  this.height = game.scale;
  this.id = id;
  this.name = tileInfo[this.id - 1][0];
  this.group = tileInfo[this.id - 1][1];
  this.img = tileInfo[this.id - 1][2];
  this.alpha = 1;
}

Tile.prototype.show = function() {
  ctx.save();

  ctx.globalAlpha = this.alpha;
  ctx.drawImage(this.img, this.x, this.y, this.width, this.height);

  ctx.restore();
}

Tile.prototype.createHitbox = function() {
  return new B(new V(this.x, this.y), this.width, this.height).toPolygon();
}

Spike = function(x, y, id) {
  Tile.call(this, x, y, id);
  //model is 28 x 22
  this._width = game.scale * 28 / 32; //32 is size of block models
  this._height = game.scale * 22 / 32;
}

Spike.prototype = Object.create(Tile.prototype);

Spike.prototype.createHitbox = function() {
  let [blX, blY] = [(this.width - this._width) / 2, this.height];
  let [brX, brY] = [(this.width - this._width) / 2 + this._width, this.height];
  let [cX, cY] = [this.width / 2, this.height - this._height];

  return new P(new V(this.x, this.y), [
    new V(blX, blY), new V(brX, brY), new V(cX, cY)
  ]);
}

Entity = function(x, y, id) {
  Tile.call(this, x, y, id);
}

Entity.prototype = Object.create(Tile.prototype);

Entity.prototype.isCollision = function(target) {
  let entity, me;

  entity = target.createHitbox();
  this.y -= 5; //for sponge purposes: so active before player hits sponge and slows down
  me = this.createHitbox();
  this.y += 5;

  let collision = SAT.testPolygonPolygon(entity, me);

  return collision;
}

Entity.prototype.tick = function() {
  console.log("Error: default entity tick method is being called");
}

Enemy = function(x, y, id) {
  Entity.call(this, x, y, id);
  this.speed = 0.8;
  this.direction = "left";
}

Enemy.prototype = Object.create(Entity.prototype);

Enemy.prototype.controlDirection = function(currentDir) {
  let xSnap;

  if(currentDir === "right") {
    xSnap = Math.ceil(this.x / game.scale) * game.scale;
  } else {
    xSnap = Math.floor(this.x / game.scale) * game.scale;
  }

  let adjacentBlock = tileList.find(target => {
    return target.x === xSnap && target.y === this.y & target.group === "solid";
  });
  if(adjacentBlock !== undefined) {
    //if enemy hits a solid tile, it turns around
    if(currentDir === "right") {
      this.direction = "left";
    } else {
      this.direction = "right";
    }

  } else {
    let adjacentBlock = tileList.find(target => {
      return target.x === xSnap && target.y === Math.round(this.y + game.scale) && target.group === "solid";
    });

    if(adjacentBlock === undefined) {
      //if enemy is about to fall off, it turns around
      if(currentDir === "right") {
        this.direction = "left";
      } else {
        this.direction = "right";
      }
    }
  }
}

Enemy.prototype.tick = function() {
  if(this.direction === "right") {
    this.x += this.speed;
  } else {
    this.x -= this.speed;
  }

  this.controlDirection(this.direction);
}

Saw = function(x, y, id) {
  Entity.call(this, x, y, id);
  this.rotation = 0;
  this.sine = 0;
}

Saw.prototype = Object.create(Entity.prototype);

Saw.prototype.tick = function() {
  this.rotation += Math.PI / 90; //+= 2 degree

  this.sine += 0.062;
  //prevents overflow
  if(this.sine > 36000) {
    this.sine = 0;
  }

  if(this.name === "sawhorizontal") {
    this.x += Math.sin(this.sine) * 1.5;
  }
  if(this.name === "sawvertical") {
    this.y -= Math.sin(this.sine) * 1.5;
  }
}

Saw.prototype.show = function() {
  ctx.save();

  ctx.globalAlpha = this.alpha;

  //pivot point is centre of image
  //but drawImage draws on top left
  //so we have to shift temporarily to correspond with top left – hence the next 2 lines
  this.x += this.width/2;
  this.y += this.height/2;

  ctx.translate(this.x, this.y);
  ctx.rotate(this.rotation);
  ctx.drawImage(this.img, -this.width/2, -this.height/2, this.width, this.height); //centre of canvas
  ctx.restore();

  //now we shift back!
  this.x -= this.width/2;
  this.y -= this.height/2;
}

Sponge = function(x, y, id) {
  Entity.call(this, x, y, id);
  this.active = false;
  this.originalY = this.y;
  this.destinationY = this.y + game.scale * 3;
  this.RAMtime = 0;
  this.timeout = 1; //seconds
}

Sponge.prototype = Object.create(Entity.prototype);

Sponge.prototype.tick = function() {
  if(this.active) {
    this.y += (this.destinationY - this.y) / 5;
    if(game.time > this.RAMtime + this.timeout) {
      this.active = false;
    }
  } else {
    this.active = (this.isCollision(player) && player.yVel <= 0); //latter ensures player is on top of sponge
    if(this.active) {
      this.RAMtime = game.time;
    } else {
      this.y += (this.originalY - this.y) / 5;
    }
  }
}

Shooter = function(x, y, id) {
  Entity.call(this, x, y, id);
  this.interval = 1;
  this.direction = (this.name === "shooterright" ? "right" : "left");
  this.RAMtime = game.time;
}

Shooter.prototype = Object.create(Entity.prototype);

Shooter.prototype.tick = function() {
  if(game.time > this.RAMtime + this.interval) {
    let bullet = new Bullet(this.x, this.y, s, this.direction)
    tileList.push(bullet);
    entityList.push(bullet);

    this.RAMtime = game.time;
  }
}

Bullet = function(x, y, id, dir) {
  Entity.call(this, x, y, id);
  this._width = game.scale * 20 / 32;
  this._height = game.scale * 8 / 32;
  this.status = "active";
  this.vel = (dir === "right" ? 2.8 : -2.8);
}

Bullet.prototype = Object.create(Entity.prototype);

Bullet.prototype.createHitbox = function() {
  let x = this.x + (this.width - this._width) / 2;
  let y = this.y + (this.height - this._height) / 2;

  return new B(new V(x, y), this._width, this._height).toPolygon();
}

Bullet.prototype.tick = function() {
  this.x += this.vel;
  if(this.x < 0 || this.x > canvas.width) {
    this.status = "inactive";
  }

  tileList.forEach((target) => {
    if(target.group === "solid") {
      if(this.isCollision(target) && target.name !== "shooterright" && target.name !== "shooterleft") {
        this.status = "inactive";
      }
    }
  });
}
