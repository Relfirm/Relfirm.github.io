let splash = {
  x: 0,
  y: 0,
  alpha: 0,
  delay: 5,
  fadeSpeed: 0.03,
  startTime: 0,

  changeAlpha: () => {
    if(splash.startTime + splash.delay > timer.time) {
      if(splash.alpha <= 1) {
        splash.alpha += splash.fadeSpeed;
      }
    } else {
      splash.alpha -= splash.fadeSpeed;
    }
  },

  changePos: () => {
    if(splash.startTime + splash.delay > timer.time) {
      splash.y += (0 - splash.y) / 5;
    } else {
      splash.y -= (1 - splash.y) / 5;
    }
  },

  init: () => {
    splash.alpha = 0;
    splash.y = -100;
    splash.startTime = 0;

    splash.tick();
  },

  tick: () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    splash.changeAlpha();
    splash.changePos();

    ctx.globalAlpha = splash.alpha;
    ctx.drawImage(img.splash_screen, splash.x, 0 - splash.y);

    if(splash.alpha < -1) {
      menu.init(true);
    } else {
      window.requestAnimationFrame(splash.tick);
    }
  }
}
