let game = {
  running: false,
  scene: "main",
  wave: 0,
  toSpawn: false,
  startTime: 0,
  finalTime: 0,

  dottedCircle: {
    x: canvas.width/2,
    y: canvas.height/2,
    offset: 0,
    rad: 100,
    arcCount: 20,

    hover: () => {
      return (mouse.x - game.dottedCircle.x) ** 2 + (mouse.y - game.dottedCircle.y) ** 2 <= game.dottedCircle.rad ** 2;
    },

    draw: () => {
      let pos = game.dottedCircle.offset;
      let increment = (2 * Math.PI) / game.dottedCircle.arcCount;

      ctx.lineWidth = "6";
      ctx.strokeStyle = "#3366ff";
      for(let i = 0; i < game.dottedCircle.arcCount; i++) {
        ctx.beginPath();
        ctx.arc(game.dottedCircle.x, game.dottedCircle.y, game.dottedCircle.rad, pos, pos + increment / 2);
        ctx.stroke();

        pos += increment;
      }

      game.dottedCircle.offset += 0.01;
      if(game.dottedCircle.offset >= 2 * Math.PI) {
        game.dottedCircle.offset = 0;
      }
    }
  },

  display: (size) => {
    ctx.fillStyle = "#1250ff";
    ctx.font = "36px sans-serif";

    if(game.scene === "main") {
      ctx.fillText(timer.time - game.startTime, 50, 550);
    }

    for(let i = 0; i < player.health; i++) {
      ctx.drawImage(img.heart, canvas.width - size * 2 - i * (size + 20), canvas.height - size * 2, size, size);
    }
  },

  spawnEnemyBatch: (item) => {
    waves[game.wave - 1].forEach((item, i) => {
      let spawnStartTime = timer.time;

      let loop = setInterval(() => {
        game.spawnEnemy(item[0]);

        if(!(item[1] === -1)) {
          if(spawnStartTime + item[1] < timer.time) {
            clearInterval(loop);
            if(i === 0) {
              game.nextLevel();
            }
          }
        }

        if(game.running === false || player.health === 0) {
          clearInterval(loop);
        }
      }, item[2]);
    });
  },

  spawnEnemy: (type) => {
    switch(type) {
      case 1:
        enemies.push(new Enemy(false, 0, 0));
        break;
      case 2:
        enemies.push(new FastEnemy(false, 0, 0));
        break;
      case 3:
        enemies.push(new BigEnemy(false, 0, 0));
        break;
      case 4:
        enemies.push(new UnstableEnemy(false, 0, 0));
        break;
      case 5:
        enemies.push(new SplitEnemy(false, 0, 0));
        break;
      case -1:
        let randomEnemy = Math.floor(Math.random() * 3) + 1;

        switch(randomEnemy) {
          case 1:
            enemies.push(new BigEnemy(false, 0, 0));
            break;
          case 2:
            enemies.push(new UnstableEnemy(false, 0, 0));
            break;
          case 3:
            enemies.push(new SplitEnemy(false, 0, 0));
            break;
        }
    }
  },

  updateEnemy: () => {
    //enemies.forEach separated to avoid flickering
    enemies.forEach((item, i) => {
      if(!item.alive) {
        enemies.splice(i, 1);
      }
    });

    enemies.forEach((item, i) => {
      item.tick();
    });
  },

  nextLevel: () => {
    console.log("NEXT LEVEL!");

    game.wave++;
    game.toSpawn = true;
  },

  init: () => {
    enemies = [];
    player.init();

    game.scene = "ready";
    game.running = true;
    game.wave = 1;
    game.toSpawn = true;

    game.startTick();
  },

  tick: () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img.background_1, 0, 0, 600, 600);

    switch(game.scene) {

      case "ready":
        if(game.dottedCircle.hover()) {
          game.startTime = timer.time;
          game.scene = "main";
        }
        game.dottedCircle.draw();
        game.display(28);

        break;

      case "main":
        if(game.toSpawn) {
          game.spawnEnemyBatch();
          game.toSpawn = false;
        }

        game.updateEnemy();

        if(player.health <= 0) {
          game.finalTime = timer.time - game.startTime;
          game.scene = "stats";
        } else {
          player.tick();
        }

        game.display(28);

        break;

      case "stats":
        game.updateEnemy();
        ctx.drawImage(img.background_2, 0, 0, 600, 600);

        //values copied from instructions & credits
        ctx.drawImage(img.stats, 100, 40, 0.5 * img.stats.width, 0.5 * img.stats.height);
        
        ctx.fillStyle = "#fff";
        ctx.font = "60px sans-serif";
        ctx.fillText(game.wave, 362, 212);
        ctx.fillText(game.finalTime, 362, 292);

        break;
    }

    mouse.clicked = false;

    if(!game.running) {
      clearInterval(game.gameLoop);
    }
  },

  startTick: () => {
    game.gameLoop = setInterval(game.tick, 1000/60);
  }
}
