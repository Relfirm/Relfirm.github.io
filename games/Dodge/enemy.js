Enemy = function(daughter, x, y) {
  this.x = x;
  this.y = y;
  this.daughter = daughter;
  this.rad = 8;
  this.xVel = 0;
  this.yVel = 0;
  this.speed = 3;
  this.img = img.enemy;
  this.randomnize = true; //if enemy needs to init
  this.alive = true;
}

Enemy.prototype.init = function() {
  this.xVel = Math.random() * this.speed;
  this.yVel = Math.sqrt(this.speed ** 2 - this.xVel ** 2);

  let edge = Math.floor(Math.random() * 4);

  //very inefficient code
  switch(edge) {
    case 0:
      if(!this.daughter) {
        this.y = canvas.height + this.rad;
        this.x = Math.random() * canvas.width;
      }
      this.yVel = -this.yVel;
      if(Math.round(Math.random())) {
        this.xVel = -this.xVel;
      }
      break;
    case 1:
      if(!this.daughter) {
        this.x = canvas.width + this.rad;
        this.y = Math.random() * canvas.height;
      }
      this.xVel = -this.xVel;
      if(Math.round(Math.random())) {
        this.yVel = -this.yVel;
      }
      break;
    case 2:
      if(!this.daughter) {
        this.y = 0 - this.rad;
        this.x = Math.random() * canvas.width;
      }
      if(Math.round(Math.random())) {
        this.xVel = -this.xVel;
      }
      break;
    case 3:
      if(!this.daughter) {
        this.x = 0 - this.rad;
        this.y = Math.random() * canvas.height;
      }
      if(Math.round(Math.random())) {
        this.yVel = -this.yVel;
      }
      break;
  }
}

Enemy.prototype.update = function() {
  if(this.randomnize) {
    this.init();
    this.randomnize = false;
  }

  if(this.x < 0 - this.rad || this.x > canvas.width + this.rad || this.y < 0 - this.rad || this.y > canvas.height + this.rad) {
    this.alive = false;
  }

  this.x += this.xVel;
  this.y += this.yVel;
}

Enemy.prototype.show = function() {
  ctx.drawImage(this.img, this.x - this.rad, canvas.height - this.y - this.rad, this.rad * 2, this.rad * 2);
}

Enemy.prototype.tick = function() {
  this.update();
  this.show();
}

//enemy prototypes
FastEnemy = function() {
  Enemy.call(this, this.daughter, this.x, this.y);
  this.speed = 5;
  this.img = img.fast_enemy;
}

FastEnemy.prototype = Object.create(Enemy.prototype);

BigEnemy = function() {
  Enemy.call(this, this.daughter, this.x, this.y);
  this.speed = 2;
  this.rad = 12;
  this.img = img.big_enemy;
}

BigEnemy.prototype = Object.create(Enemy.prototype);

UnstableEnemy = function() {
  Enemy.call(this, this.daughter, this.x, this.y);
  this.delay = 2;
  this.startTime = timer.time;
  this.img = img.unstable_enemy;
}

UnstableEnemy.prototype = Object.create(Enemy.prototype);

UnstableEnemy.prototype.toExplode = function() {
  if(this.startTime + this.delay < timer.time) {
    this.xVel = 0;
    this.yVel = 0;

    this.rad += 2;
    if(this.rad > 80) {
      this.alive = false;
    }
  }
}

UnstableEnemy.prototype.tick = function() {
  this.update();
  this.toExplode();
  this.show();
}

SplitEnemy = function() {
  UnstableEnemy.call(this, this.daughter, this.x, this.y);
  this.speed = 2;
  this.rad = 12;
  this.img = img.split_enemy;
}

SplitEnemy.prototype = Object.create(UnstableEnemy.prototype);

SplitEnemy.prototype.toExplode = function() {
  if(this.startTime + this.delay < timer.time) {
    for(let i = 0; i < 3; i++) {
      enemies.push(new Enemy(true, this.x, this.y));
    }

    this.alive = false;
  }
}
