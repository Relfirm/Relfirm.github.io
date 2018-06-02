let player = {
  x: 0,
  _y: 0,
  y: 0, //y position without reflection
  width: game.scale * 0.8,
  height: game.scale * 0.8,
  xVel: 0,
  yVel: 0,
  xAccel: 0.3,
  yJump: 5,
  yBoost: 7,
  airTime: 0,
  status: "spawn",

  img: img.player_bob,
  alpha: 1,

  setY: function() {
    /*
      canvas.height - this._y
      this reflects image along central horizontal line
      ... - this.height
      so image draws on bottom-left instead of top-left
    */
    this.y = canvas.height - this._y - this.height;
  },

  createHitbox: function() {
    return new B(new V(this.x, this.y), this.width, this.height).toPolygon();
  },

  startPos: function(coordinate) {
    let start = tileList.find((target) => {
      return target.name === "start";
    });

    if(coordinate === "x") {
      return start.x;
    }
    if(coordinate === "y") {
      return canvas.height - this.height - start.y; //opposite of this.setY();
    }
  },

  isCollision: function(target) {
    let me, entity;
    me = this.createHitbox();
    entity = target.createHitbox();

    let collision = SAT.testPolygonPolygon(me, entity);

    return collision;
  },

  init: function() {
    this.x = this.startPos("x");
    this._y = this.startPos("y");
    this.setY();
    this.xVel = 0;
    this.yVel = 0;
    this.airTime = 0;
    this.alpha = 0;
    this.status = "spawn";
  },

  animateSpawn: function() {
    if(this.alpha < 1) {
      this.alpha += 0.05;

      //validation check as JavaScript messes up arithmetics
      if(this.alpha > 1) {
        this.alpha = 1;
      }
    } else {
      this.status = "alive";
    }
  },

  animateDeath: function() {
    if(this.alpha > 0) {
      this.alpha -= 0.05;

      //validation check as JavaScript messes up arithmetics
      if(this.alpha < 0) {
        this.alpha = 0;
      }
    } else {
      if(player.status === "finish") {
        game.level++;
      }
      game.restart();
    }
  },

  tick: function() {
    //tick player y
    this.yVel -= game.gravity; //consider this.gravity x this.weight
    this._y += this.yVel;

    //detect upper and lower surface of block
    let isRoof = this.yVel > 0;
    this.fall++;

    tileList.forEach((target) => {
      if(target.group === "solid") {
        while(this.isCollision(target)) {
          if(isRoof) {
            this._y-= 0.3;
          } else {
            this._y+= 0.3;
            this.fall = 0;
          }
          this.setY();
          this.yVel = 0;
        }
      }
    });

    //tick player x
    this.xVel *= game.friction;
    if(keyList[37]) {
      this.xVel -= this.xAccel;
    } else if(keyList[39]) {
      this.xVel += this.xAccel;
    }

    //detect left and right surface of block
    if(Math.abs(this.xVel) > 0.5) {
      this.x += this.xVel;

      tileList.forEach((target) => {
        if(target.group === "solid") {
          if(this.isCollision(target)) {
            this.x -= this.xVel;

            //sticks player to wall
            if(this.xVel < 0) {
              do {
                this.x -= 0.3;
              } while(!(this.isCollision(target)));

              this.x += 0.3;
            } else {
              do {
                this.x += 0.3;
              } while(!(this.isCollision(target)));

              this.x -= 0.3;
            }

            this.xVel = 0;
          }
        }
      });
    }

    this._y--; //player will be touching ground again
    this.setY();

    //player jump
    if(keyList[38] && this.fall === 0) {
      tileList.forEach((target) => {
        if(target.group === "solid") {
          if(this.isCollision(target)) {
            this.yVel = this.yJump;
          }
        }

      });
    }

    //other tiles detection
    let isBoostRight, isBoostLeft;

    isBoostRight = false;
    isBoostLeft = false;

    this.yJump = 5;

    tileList.forEach((target) => {
      if(this.isCollision(target)) {

        switch(target.name) {
          case "finish":
            this.status = "finish";
            break;

          case "boostup":
            this.yJump = this.yBoost;
            break;

          case "boostright":
            if(!isBoostRight) { //so if a player touches 2 adjacent boost right blocks, effect doesn't trigger twice
              isBoostRight = true;
              this.xVel += this.xAccel * 0.9;
            }
            break;

          case "boostleft":
            if(!isBoostLeft) {
              isBoostLeft = true;
              this.xVel -= this.xAccel * 0.9;
            }
            break;

          case "nojump":
            this.yJump = 0;
            break;

          case "enemy":
            this.status = "death";
            break;
        }

        switch(target.group) {
          case "harmful":
            this.status = "death";
            break;
        }
      }
    });

    this._y++;

    //player falls out of world
    if(this._y < 0) {
      this.status = "death";
    }

    //local y position must be pushed to global y position
    this.setY();
  },

  show: function() {
    ctx.save();

    ctx.globalAlpha = this.alpha;
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);

    ctx.restore();
  }
}
