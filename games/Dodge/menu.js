let menu = {
  running: false,
  scene: "main",

  buttons: [
    "play",
    "instructions",
    "credits"
  ],

  character: {
    x: canvas.width/2,
    y: 326,
    rad: 48,
    current: 0,

    hover: () => {
      return (mouse.x - menu.character.x) ** 2 + (mouse.y - menu.character.y) ** 2 <= menu.character.rad ** 2;
    },

    init: () => {
      player.x = menu.character.x;
      player.y = menu.character.y;
      player.rad = menu.character.rad;
    },

    tick: () => {
      player.show();

      if(menu.character.hover() && mouse.clicked) {
        menu.character.current++;
        if(menu.character.current >= player.img.length) {
          menu.character.current = 0;
        }

        img.player.src = player.img[menu.character.current];
      }
    }

  },

  pointer: {
    index: 0,
    xOffset: 0,
    sin: 0,

    tick: () => {
      menu.pointer.sin += 0.08;
      menu.pointer.xOffset += Math.sin(menu.pointer.sin);

      if(menu.pointer.sin === 360) {
        menu.pointer.sin = 0;
      }
    },

    show: (y, gap, scale) => {
      ctx.drawImage(img.pointer, menu.centralise(img.button_play, scale) - 80 + menu.pointer.xOffset, y + gap * (4 + menu.pointer.index), scale * img.pointer.width, scale * img.pointer.height);
    }
  },

  centralise: (image, scale) => {
    return canvas.width / 2 - image.width * scale / 2;
  },

  init: (tick) => {
    game.running = false;
    ctx.globalAlpha = 1;

    menu.scene = "main";
    menu.character.init();
    menu.pointer.index = 0;
    menu.running = true;

    if(tick) {
      menu.tick();
    }
  },

  renderMain: (y, gap, scale) => {
    //title
    ctx.drawImage(img.title, menu.centralise(img.title, scale), y - 20, scale * img.title.width, scale * img.title.height);

    //character select
    menu.character.tick();

    //buttons
    let width = img.button_play.width * scale; //as buttons all have same width
    let height = img.button_play.height * scale;

    ctx.drawImage(img.button_play, menu.centralise(img.button_play, scale), y + gap * 4, width, height);
    ctx.drawImage(img.button_instructions, menu.centralise(img.button_instructions, scale), y + gap * 5, width, height);
    ctx.drawImage(img.button_credits, menu.centralise(img.button_credits, scale), y + gap * 6, width, height);

    //pointer
    menu.pointer.tick();
    menu.pointer.show(y, gap, scale);
  },

  renderInstructions: (x, y, scale) => {
    ctx.drawImage(img.instructions, x, y, scale * img.instructions.width, scale * img.instructions.height);
  },

  renderCredits: (x, y, scale) => {
    ctx.drawImage(img.credits, x, y, scale * img.credits.width, scale * img.credits.height);
  },

  tick: () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img.background_1, 0, 0, 600, 600);

    switch(menu.scene) {
      case "main":
        menu.renderMain(100, 68, 0.5);
        break;

      case "play":
        menu.running = false;
        game.init();
        break;

      case "instructions":
        ctx.drawImage(img.background_2, 0, 0, 600, 600);
        menu.renderInstructions(100, 40, 0.5);
        break;

      case "credits":
        ctx.drawImage(img.background_2, 0, 0, 600, 600);
        menu.renderCredits(100, 40, 0.5);
        break;

    }

    mouse.clicked = false;

    if(menu.running) {
      window.requestAnimationFrame(menu.tick);
    }
  }

}
