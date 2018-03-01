let player = {
  x: 0,
  y: 0,
  rad: 14,
  xVel: 0,
  yVel: 0,
  limit: 8, //speed limit
  health: 5,
  img: [
    "img/player/blue.svg",
    "img/player/pink.svg"
  ],

  checkCollision: () => {
    enemies.forEach((item, i) => {
      if((item.x - player.x) ** 2 + (item.y - player.y) ** 2 < (player.rad + item.rad) ** 2) {
        enemies.splice(i, 1);
        player.health--;
      }
    });
  },

  init: () => {
    player.x = canvas.width/2;
    player.y = canvas.height/2;
    player.rad = 14;
    player.xVel = 0;
    player.yVel = 0;
    player.limit = 8;
    player.health = 5;
  },

  tick: () => {
    player.xVel = (mouse.x - player.x) / 8;
    player.yVel = (mouse.y - player.y) / 8;

    if(player.xVel ** 2 + player.yVel ** 2 > player.limit ** 2) {
      let xNegative = player.xVel < 0 ? true : false;
      let ratio = player.yVel / player.xVel;

      player.xVel = Math.sqrt(player.limit ** 2 / (1 + ratio ** 2));
      if(xNegative) {
        player.xVel = -player.xVel;
      }

      player.yVel = player.xVel * ratio;
    }

    player.x += player.xVel;
    player.y += player.yVel;
    player.xVel *= 0.8;
    player.yVel *= 0.8;

    player.checkCollision();

    player.show();
  },

  show: () => {
    ctx.drawImage(img.player, player.x - player.rad, canvas.height - player.y - player.rad, player.rad * 2, player.rad * 2);
  }
}
