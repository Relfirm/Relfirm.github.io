const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let waves = [
  // [enemyType, duration in s, delay in ms]
  // longest duration of enemy batch per wave is put at index 0
  // duration of -1 is infinite
  /*
    1 = Enemy
    2 = FastEnemy
    3 = BigEnemy
    4 = UnstableEnemy
    5 = SplitEnemy
    -1 = spawns random enemy between 3, 4, 5
  */
  [[1, 5, 200]],
  [[1, 5, 200], [2, 5, 500]],
  [[1, 5, 200], [3, 5, 500]],
  [[4, 8, 300]],
  [[1, 12, 180], [2, 12, 500], [3, 12, 500]],
  [[5, 8, 300]],
  [[1, 6, 180], [2, 6, 400], [4, 6, 500]],
  [[1, 6, 180], [2, 6, 400], [5, 6, 500]],
  //endless mode
  [[1, -1, 150], [2, -1, 500], [-1, -1, 400]]
];

let enemies = [];

let img = {};

img.player = new Image();
img.player.src = "img/player/blue.svg";

img.enemy = new Image();
img.enemy.src = "img/enemy/enemy.svg";

img.fast_enemy = new Image();
img.fast_enemy.src = "img/enemy/fast_enemy.svg";

img.big_enemy = new Image();
img.big_enemy.src = "img/enemy/big_enemy.svg";

img.unstable_enemy = new Image();
img.unstable_enemy.src = "img/enemy/unstable_enemy.svg";

img.split_enemy = new Image();
img.split_enemy.src = "img/enemy/split_enemy.svg";

img.splash_screen = new Image();
img.splash_screen.src = "img/splash_screen.svg";

img.heart = new Image();
img.heart.src = "img/game/heart.svg";

img.stats = new Image();
img.stats.src = "img/game/stats.svg";

img.title = new Image();
img.title.src = "img/menu/title.svg";

img.button_play = new Image();
img.button_play.src = "img/menu/button_play.svg";

img.button_instructions = new Image();
img.button_instructions.src = "img/menu/button_instructions.svg";

img.button_credits = new Image();
img.button_credits.src = "img/menu/button_credits.svg";

img.pointer = new Image();
img.pointer.src = "img/menu/pointer.svg";

img.instructions = new Image();
img.instructions.src = "img/menu/instructions.svg";

img.credits = new Image();
img.credits.src = "img/menu/credits.svg";

img.background_1 = new Image();
img.background_1.src = "img/background/tiles.svg";

img.background_2 = new Image();
img.background_2.src = "img/background/blue.svg";

window.onload = () => {
  //todo
  console.log("Problems: ");
  console.log("Jerky movement at the beginning so try rounding velocity");

  console.log("Notes: ");
  console.log("All in-game objects are top down");
  console.log("Font width is widened by 5%");

  music.init();
  timer.tick();
  splash.init();
}
