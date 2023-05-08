/**
 * Engine: handles game loop
 */

import Sprite from './sprite.js';

const { ceil, floor, min, max, random, round } = Math;

const TILE_SIZE = 16; // tile pixel dimensions X/Y
const GRAVITY = 0.25; // gravity acts on airborne sprite by this factor
const MAX_Y = 6; // a falling sprite cannot move faster than this (TODO use same value for x momentum?)

let _win;
let _context;
let _assets;

let _levelData = [];
let _sprite = new Sprite(
  10,
  18,
  TILE_SIZE,
  TILE_SIZE,
  TILE_SIZE
); // haha

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
    _sprite.xM += 0.75;
  } else if (_activeInput.includes(KEY_LEFT)) {
    _sprite.xM -= 0.75;
  }

  if (_activeInput.includes(KEY_JUMP)) {
    // can only jump if grounded and not in jump limbo
    if (_sprite.anchored && !_sprite.jumpLimbo) {
      _sprite.yM = -5;
      _sprite.jumpLimbo = true; // prevent jump until out of limbo
    }
  } else if (_sprite.anchored) {
    // only out of jump limbo when on the ground
    _sprite.jumpLimbo = false;
  }

  // loop ENDS with a clear and redraw.
  _clearCanvas();
  _drawTiles(_levelData, _assets);
  _sprite.drawSprite(_context);

  // TODO add flag, etc. so this can be toggled
  _drawDebugInfo();

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
  let iTiles = _sprite.interceptingTiles(_levelData, 'x');

  if (iTiles.includes(1) && _sprite.xM !== 0) {
    _sprite.flushPosition('x');
    _sprite.xM = 0;
  } else {
    // natural horizontal slowdown
    _sprite.xM = _sprite.xM / 1.5;
    if (_sprite.xM < 0.1 && _sprite.xM > -0.1) {
      _sprite.xM = 0;
      _sprite.x = round(_sprite.x);
    }
  }

  _sprite.x += _sprite.xM;

  // now check yMomentum. but first, gravity ALWAYS affects yMomentum.
  _sprite.yM = min(_sprite.yM + GRAVITY, MAX_Y);

  // recheck intercepting tiles - as may have changed due to xM above
  iTiles = _sprite.interceptingTiles(_levelData, 'y');

  if (iTiles.includes(1) && _sprite.yM !== 0) {
    _sprite.flushPosition('y');
    _sprite.anchored = _sprite.yM > 0;
    _sprite.yM = 0;
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

function _drawDebugInfo() {
  _context.font = "12px monospace";
  _context.fillStyle = '#dddddd';
  _context.textBaseline = 'top';
  _context.fillText(`${_sprite.x.toFixed(2)
    },${_sprite.y.toFixed(2)
    } ${_sprite.xM.toFixed(2)
    } ${_sprite.yM.toFixed(2)
    } ${_sprite.anchored}
    `, 0, 0);
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
