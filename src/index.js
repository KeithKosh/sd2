import settings from "./settings.js";

// TODO: these should be moved somewhere better probably
let canvas;
let context;

let canvasWidth;
let canvasHeight;

document.addEventListener('DOMContentLoaded', init, false);

function init() {
  canvas = document.createElement("canvas");
  canvas.id = "gameCanvas";

  // TODO, not sure if best place for this...
  canvasWidth = settings.SCREEN_WIDTH * settings.TILE_SIZE * settings.PIXEL_SCALE;
  canvasHeight = settings.SCREEN_HEIGHT * settings.TILE_SIZE * settings.PIXEL_SCALE;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  context = canvas.getContext('2d');
  context.scale(settings.PIXEL_SCALE, settings.PIXEL_SCALE);
  context.imageSmoothingEnabled = false;

  // TODO, these might end up moving/changing...
  document.body.style.height = '100%';
  document.body.style.overflow = 'hidden';
  document.body.appendChild(canvas);

  gameLoop();
}

function gameLoop() {
  // TODO: need to cap this at 60fps

  clearCanvas();
  drawBG();
  drawTiles(); // TODO: this will be "lower layer" tiles as a param
  // TODO: read input
  // TODO: update movement vars, camera, etc.
  // TODO: draw sprites
  // TODO: draw FG tiles (i.e. drawTiles(false) for "higher layer" tiles)
  // TODO: any screen effects? distortion, lighting, etc...
  // TODO: draw UI

  //requestAnimationFrame(gameLoop);
}

function clearCanvas() {
  context.clearRect(0, 0, canvasWidth, canvasHeight);
}

function drawBG() {
  // TODO: this may be replaced with an image or even with pure tiles instead?
  context.fillStyle = "#002080";
  context.fillRect(0, 0, 500, 500);
}

function drawTiles() {
  // TODO: draw to a temp canvas before we copy to screen as LAST STEP

  // TODO, this will obviously be replaced with png sprite(s)...
  let drawTile = (x, y) => {
    context.fillStyle = '#505050';
    context.fillRect(x, y, settings.TILE_SIZE, settings.TILE_SIZE);
    context.fillStyle = '#aaa';
    context.fillRect(x + 1, y + 1, settings.TILE_SIZE - 2, settings.TILE_SIZE - 2);
  }

  // TODO: replace with loaded map data(probably array or string parse)
  // just a border for now...
  for (let y = 0; y < settings.SCREEN_HEIGHT; y++) {
    for (let x = 0; x < settings.SCREEN_WIDTH; x++) {
      // only draw the full top and bottom rows, and the first/last column otherwise
      if ((y == 0 || y == settings.SCREEN_HEIGHT - 1) ||
        (x == 0 || x == settings.SCREEN_WIDTH - 1)) {
        drawTile(x * settings.TILE_SIZE, y * settings.TILE_SIZE);
      }
    }
  }
}