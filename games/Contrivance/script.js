const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const V = SAT.Vector;
const P = SAT.Polygon;
const B = SAT.Box;

let tileList = [];
let entityList = [];
let backgroundList = [];

let img = {};

img.tile_normal = new Image();
img.tile_normal.src = "img/tiles/normal.svg";

img.tile_normal_rtl = new Image();
img.tile_normal_rtl.src = "img/tiles/normal_rtl.svg";

img.tile_normal_rtr = new Image();
img.tile_normal_rtr.src = "img/tiles/normal_rtr.svg";

img.tile_normal_rbr = new Image();
img.tile_normal_rbr.src = "img/tiles/normal_rbr.svg";

img.tile_normal_rbl = new Image();
img.tile_normal_rbl.src = "img/tiles/normal_rbl.svg";

img.tile_normal_rt = new Image();
img.tile_normal_rt.src = "img/tiles/normal_rt.svg";

img.tile_normal_rr = new Image();
img.tile_normal_rr.src = "img/tiles/normal_rr.svg";

img.tile_normal_rb = new Image();
img.tile_normal_rb.src = "img/tiles/normal_rb.svg";

img.tile_normal_rl = new Image();
img.tile_normal_rl.src = "img/tiles/normal_rl.svg";

img.tile_normal_r = new Image();
img.tile_normal_r.src = "img/tiles/normal_r.svg";

img.tile_boostup = new Image();
img.tile_boostup.src = "img/tiles/boostup.svg";

img.tile_boostright = new Image();
img.tile_boostright.src = "img/tiles/boostright.svg";

img.tile_boostleft = new Image();
img.tile_boostleft.src = "img/tiles/boostleft.svg";

img.tile_nojump = new Image();
img.tile_nojump.src = "img/tiles/nojump.svg";

img.spike = new Image();
img.spike.src = "img/tiles/spike.svg";

img.null = new Image();
img.null.src = "img/tiles/null.svg";

img.finish = new Image();
img.finish.src = "img/tiles/finish.svg";

img.enemy = new Image();
img.enemy.src = "img/entity/enemy.svg";

img.saw = new Image();
img.saw.src = "img/entity/saw.svg";

img.sponge = new Image();
img.sponge.src = "img/entity/sponge.svg";

img.shooter = new Image();
img.shooter.src = "img/entity/shooter.svg";

img.bullet = new Image();
img.bullet.src = "img/entity/bullet.svg";

img.player_bob = new Image();
img.player_bob.src = "img/player/bob.svg";

img.player_alice = new Image();
img.player_alice.src = "img/player/alice.svg";

img.steampunk = new Image();
img.steampunk.src = "img/background/steampunk.svg";

img.intro = new Image();
img.intro.src = "img/background/intro.svg";

img.ending = new Image();
img.ending.src = "img/misc/ending.svg";

img.wip = new Image();
img.wip.src = "img/misc/wip.svg";

let audio = {
  current: null,
  volume: 1,

  playTune: function(target, loop) {
    this.current = target;

    target.loop = loop;
    target.currentTime = 0;
    target.play();
  }
};

audio.music = new Audio("audio/thunderzone_v2.mp3");

window.onload = () => {
  console.log("Problems:");
  console.log("Blocks may override effects, e.g. placing boostup and nojump next to each other.");
  console.log("Fix finish hitbox or create new design.");

  ctx.drawImage(img.intro, 0, 0, canvas.width, canvas.height);

  canvas.onclick = () => {
    if(!game.playing) {
      game.init();
    }
  }
}
