let timer = {
  date: new Date(),
  time: 0,
  ram: 0,

  tick: () => {
    timer.date = new Date();

    if(timer.ram !== timer.date.getSeconds()) {
      timer.ram = timer.date.getSeconds();
      timer.time++;
    }
  },

  startTick: () => {
    setInterval(timer.tick, 1000 / 60);
  }
}

let music = {
  tune: new Audio("audio/higher.mp3"),
  volume: 1,

  init: () => {
    music.tune.loop = true;
    music.tune.volume = music.volume;
    music.tune.currentTime = 0;
    music.tune.play();
  }
}

let mouse = {
  x: 0,
  y: 0,
  clicked: false
}

canvas.onmousemove = (e) => {
  let pos = canvas.getBoundingClientRect();
  mouse.x = e.clientX - pos.left;
  mouse.y = canvas.height - (e.clientY - pos.top); //as canvas is top down
}

canvas.onmousedown = (e) => {
  mouse.clicked = true;
}

document.addEventListener("keydown", e => {
  if(menu.running) {
    switch(e.keyCode) {
      case 40:
      case 39:
        menu.pointer.index++;
        if(menu.pointer.index === menu.buttons.length) {
          menu.pointer.index = 0;
        }
        break;

      case 38:
      case 37:
        menu.pointer.index--;
        if(menu.pointer.index === -1) {
          menu.pointer.index = menu.buttons.length - 1;
        }
        break;

      case 32:
        switch(menu.scene) {
          case "main":
            menu.scene = menu.buttons[menu.pointer.index];
            break;

          case "instructions":
          case "credits":
            menu.init(false); //no tick
            break;
        }
        break;
    }
  }

  if(game.running) {
    switch(e.keyCode) {
      case 32:
        if(game.scene === "stats") {
          game.running = false;
          menu.init(true);
        }

      break;
    }
  }
});
