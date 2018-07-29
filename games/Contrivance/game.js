let game = {
  scale: 24,
  gravity: 0.2,
  friction: 0.9,
  time: 0,
  resetTime: false,
  previousTime: 0,
  level: 1,
  noLevels: 12,
  playing: false,

  initLevel: function() {
    tileList = [];
    entityList = [];

    for(let i = 0; i < levels[game.level - 1].length; i++) {
      levels[game.level - 1][i].forEach((id, j) => {
        let myObject;

        if(!(id === 0)) {
          if(id === f) {
            myObject = new Spike(j * game.scale, i * game.scale, id);
          } else if(id === k) {
            myObject = new Enemy(j * game.scale, i * game.scale, id);
            entityList.push(myObject);
          } else if(id === n || id === o) {
            myObject = new Saw(j * game.scale, i * game.scale, id);
            entityList.push(myObject);
          } else if(id === p) {
            myObject = new Sponge(j * game.scale, i * game.scale, id);
            entityList.push(myObject);
          } else if(id === q || id === r) {
            myObject = new Shooter(j * game.scale, i * game.scale, id);
            entityList.push(myObject);
          } else {
            myObject = new Tile(j * game.scale, i * game.scale, id);
          }

          tileList.push(myObject);

        }
      });
    }
  },

  showLevel: function() {
    entityList.forEach((target, i) => {
      target.tick();
    });

    tileList.forEach((target) => {
      target.show();
    });
  },

  updateTime: function(time) {
    if(game.resetTime) {
      game.previousTime = time;
      game.resetTime = false;
    }

    game.time = Math.floor((time - game.previousTime)) / 1000;
  },

  init: function() {
    game.playing = true;

    ctx.globalAlpha = 1;

    game.level = 1;
    game.restart();

    audio.playTune(audio.music, true);
    game.tick();
  },

  restart: function() {
    game.time = 0;
    game.initLevel();

    backgroundList = [];
    for(let i = 0; i < 10; i++) {
      backgroundList.push(new Steampunk());
    }

    player.init();
    game.resetTime = true;
  },

  tick: function(time = 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#f2f2f2";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    backgroundList.forEach((target) => {
      target.tick();
    });

    audio.current.volume = audio.volume;

    let _time = time;
    game.updateTime(_time);

    if(game.level <= game.noLevels) {
      switch(player.status) {
        case "spawn":
          player.animateSpawn();
          break;

        case "alive":
          player.tick();
          break;

        case "death":
        case "finish":
          player.animateDeath();
          break;
      }

      tileList.forEach((target, i) => {
        if(target.status === "inactive") {
          tileList.splice(i, 1);
        }
      });

      entityList.forEach((target, i) => {
        if(target.status === "inactive") {
          entityList.splice(i, 1);
        }
      });

      player.show();
      game.showLevel();
    } else {
      ctx.drawImage(img.ending, 0, 0, canvas.width, canvas.height);
    }

    window.requestAnimationFrame(game.tick);
  }

}
