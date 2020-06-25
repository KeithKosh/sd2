/**
 * Engine: handles game loop
 */

const { ceil, floor, min, max, random, round } = Math;

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

  // first check only intercepting tiles w/o momentum?
  // this way we can check for being in water, in front of special tile, etc.
  // TODO do this later.

  // X and Y must be checked seperately as each can afect the other.
  // give preferential check to X first - doesn't matter too much.

  // NOTE: checks with xMomemtum included
  let iTiles = getInterceptingTiles(_sprite, _levelData, 'x');

  if (iTiles.includes(1) && _sprite.xM) {
    // BONK
    _sprite.xM = 0;
    // do some rounding.
  } else {
    _sprite.xM = _sprite.xM / 1.5;
    if (_sprite.xM < 0.1 && _sprite.xM > -0.1) _sprite.xM = 0;
  }

  _sprite.x += _sprite.xM;

  // now check yMomentum. but first, gravity ALWAYS affects yMomentum.
  _sprite.yM = min(_sprite.yM + GRAVITY, MAX_Y);

  // recheck intercepting tiles - as may have changed due to xM above
  iTiles = getInterceptingTiles(_sprite, _levelData, 'y');

  if (iTiles.includes(1)) {
    if (_sprite.yM > 0) {
      // ground! land only if not previously on ground
      if (!_sprite.anchored) {
        // ROUND
        _sprite.y += _sprite.yM - ((_sprite.y + _sprite.yM) % TILE_SIZE); // todo: subtract sprite height instead of TILE_SIZE
        _sprite.anchored = true;
      }
      // but always reset any momentum
      _sprite.yM = 0;
    } else if (_sprite.yM < 0) {
      _sprite.yM = _sprite.yM / -2;
    }
  } else {
    _sprite.anchored = false;
  }

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
        levelData[y][x] = (x !== 1 || y !== 1) && round(random() * 8) + 1 > 7 ? 1 : 0;
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
  /* note rounding: this way we can store more precise values interally, but
     (generally) always draw everything to a whole pixel for precise graphics. */
  _context.fillRect(round(_sprite.x), round(_sprite.y), TILE_SIZE, TILE_SIZE);
}

function getInterceptingTiles(sprite, levelData, includeMomentum) {
  let addXMomentum = includeMomentum === 'x';
  let addYMomentum = includeMomentum === 'y';
  // get sprite coordinates in tileset units
  /* NOTE: momentum is always rounded UP when calculating intersects so
     small momentum values will always check the next tile over. */
  let tileStartX = floor((sprite.x + 
    (addXMomentum && sprite.xM < 0 ? ceil(sprite.xM) : 0)
  ) / TILE_SIZE);
  let tileEndX = floor((sprite.x + TILE_SIZE - 1 + 
    (addXMomentum && sprite.xM > 0 ? ceil(sprite.xM) : 0)
  ) / TILE_SIZE); // TODO add sprite width instead of TILE_SIZE
  let tileStartY = floor((sprite.y +
    (addYMomentum && sprite.yM < 0 ? ceil(sprite.yM) : 0)
  ) / TILE_SIZE);
  let tileEndY = floor((sprite.y + TILE_SIZE - 1 +
    (addYMomentum && sprite.yM > 0 ? ceil(sprite.yM) : 0)
  ) / TILE_SIZE); // TODO add sprite height instead of TILE_SIZE

  let tileArray = [];
  for (let y = tileStartY; y <= tileEndY; y++) {
    for (let x = tileStartX; x <= tileEndX; x++) {
      tileArray.push(levelData[y][x]);
    }
  }

  // console.log(`check from ${tileStartX},${tileStartY} to ${tileEndX},${tileEndY}: ${tileArray}`);

  return tileArray;
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
