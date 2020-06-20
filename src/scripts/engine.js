/**
 * Engine: handles game loop
 */

const { min, max, random, round } = Math;

const TILE_SIZE = 16; // tile pixel dimensions X/Y
const GRAVITY = 0.25; // gravity acts on airborne sprite by this factor
const MAX_Y = 4; // a falling sprite cannot move faster than this (TODO use same value for x momentum?)

let _win;
let _context;
let _assets;

let _levelData = [];
let _sprite = { x: TILE_SIZE, y: TILE_SIZE, xM: 0, yM: 0, anchored: true };

let SCREEN_COLUMNS = 17;
let SCREEN_ROWS = 10;

let _activeInput = [];
let KEY_LEFT = 65;
let KEY_RIGHT = 68;
let KEY_JUMP = 74;

export function beginGameLoop(win, context, assets) {
  _win = win;
  _context = context;
  _assets = assets;

  _levelData = _buildLevel();

  addKeyListeners();

  _gameLoop();
}

function _gameLoop() {
  // loop STARTS with necessary physics, movement changes, etc.
  // this needs to be first as it resets some necessary momentum that
  // needs to be reset in order for an input to trigger a jump/move.
  _updatePhysics();

  // loop CONTINUES with input monitoring/influencing.
  if (_activeInput.includes(KEY_RIGHT)) {
    _sprite.xM += 1;
  } else if (_activeInput.includes(KEY_LEFT)) {
    _sprite.xM += -1;
  }

  if (_activeInput.includes(KEY_JUMP)) {
    // can only jump if grounded
    if (_sprite.anchored) _sprite.yM = -5;
  }

  // loop ENDS with a clear and redraw.
  _clearCanvas();
  _drawTiles(_levelData, _assets);
  _drawChar();

  // frame is fully drawn, wait until next frame.
  _win.requestAnimationFrame(_gameLoop);
}

function _updatePhysics() {
  // TODO condense into separate class, but for now fine here.

  // first of all: check yMomentum
  // gravity ALWAYS affects yMomentum.

  _sprite.yM = min(_sprite.yM + GRAVITY, MAX_Y);

  // now check if sprite has ground below it.
  let xCoord = min(max(0, round(_sprite.x / TILE_SIZE)), SCREEN_COLUMNS - 1);
  let yCoord = min(max(0, round((_sprite.y + TILE_SIZE) / TILE_SIZE)), SCREEN_ROWS - 1);

  let below = _levelData[yCoord][xCoord];

  if (below === 1 && _sprite.yM >= 0) {
    // ground! land only if not previously on ground
    if (!_sprite.anchored) {
      // TODO land
      _sprite.anchored = true;
    }
    // but always reset any momentum
    _sprite.yM = 0;
  } else {
    _sprite.anchored = false;
  }

  // now check xMomentum

  xCoord = min(max(0, round((_sprite.x + _sprite.xM) / TILE_SIZE)), SCREEN_COLUMNS - 1);
  yCoord = min(max(0, round(_sprite.y / TILE_SIZE)), SCREEN_ROWS - 1);
  let beside = _levelData[yCoord][xCoord];

  if (beside && _sprite.xM) {
    _sprite.xM = 0;
  } else {
    _sprite.xM = _sprite.xM / 1.5;
    if (_sprite.xM < 0.1 && _sprite.xM > -0.1) _sprite.xM = 0;
  }

  // NOTE: no rounding - this is only done on screen draw.
  _sprite.x += _sprite.xM;
  _sprite.y += _sprite.yM;
}

function _clearCanvas() {
  _context.clearRect(0, 0, 272, 160);
}

function _buildLevel() {
  let levelData = new Array(SCREEN_ROWS);

  for (let y = 0; y < SCREEN_ROWS; y++) {
    levelData[y] = new Array(SCREEN_COLUMNS);
    for (let x = 0; x < SCREEN_COLUMNS; x++) {
      if (y === 0 || y === SCREEN_ROWS - 1 || x === 0 || x === SCREEN_COLUMNS - 1) {
        levelData[y][x] = 1;
      } else {
        levelData[y][x] = round(random() * 8) + 1 > 7 ? 1 : 0;
      }
    }
  }

  return levelData;
}

function _drawTiles(levelData, block) {
  for (let y = 0; y < SCREEN_ROWS; y++) {
    for (let x = 0; x < SCREEN_COLUMNS; x++) {
      if (levelData[y][x]) {
        _context.drawImage(block, x * TILE_SIZE, y * TILE_SIZE);
      }
    }
  }
}

function _drawChar() {
  _context.fillStyle = "#CC0000";
  _context.fillRect(round(_sprite.x), round(_sprite.y), TILE_SIZE, TILE_SIZE);
}

// -------- TODO move to separate input script
function addKeyListeners() {
  window.addEventListener('keydown', updateInputQueue, false);
  window.addEventListener('keyup', updateInputQueue, false);
}

function updateInputQueue(evt) {
  let keyCode = evt.keyCode;
  if (evt.type === 'keydown') {
    if (!_activeInput.includes(keyCode)) _activeInput.push(keyCode);
  } else {
    if (_activeInput.includes(keyCode)) _activeInput.splice(_activeInput.indexOf(keyCode), 1);
  }
}
