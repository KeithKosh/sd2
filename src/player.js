import settings from "./settings.js";

const KEY_LEFT = 37;
const KEY_RIGHT = 39;
//const KEY_UP = 38;
//const KEY_DOWN = 40;
// const KEY_SPACE = 32;

const X_MOVEMENT_INFLUENCE = 1;
const MAX_RUN_SPEED = 5;
const BASICALLY_STOPPED = 0.001;

const { abs } = Math;

export class Player {
  /* TODO: this will likely extend a default sprite? is there a difference other than
     input movement which is handled elsewhere anyway...? */
  
  constructor() {
    // initialize at (1,1) tile coordinates
    this.x = settings.TILE_SIZE;
    this.y = settings.TILE_SIZE;

    // two tall, one wide, for now
    this.width = settings.TILE_SIZE;
    this.height = settings.TILE_SIZE * 2;

    this.xSpeed = 0;
    this.ySpeed = 0;
  }

  applyMomentum(keyQueue) {
    // process keys first
    /* note predence taken over competing directions (namely left and right):
       the key pressed LATEST wins. */
    let isPressed = (k) => keyQueue.indexOf(k) > -1;

    if (isPressed(KEY_LEFT) &&
      (!isPressed(KEY_RIGHT) || keyQueue.indexOf(KEY_LEFT) > keyQueue.indexOf(KEY_RIGHT))
    ) {
      this.xSpeed -= X_MOVEMENT_INFLUENCE;
      if (this.xSpeed < -MAX_RUN_SPEED) this.xSpeed = -MAX_RUN_SPEED;
    } else if (isPressed(KEY_RIGHT) &&
      (!isPressed(KEY_RIGHT) || keyQueue.indexOf(KEY_RIGHT) > keyQueue.indexOf(KEY_LEFT))
    ) {
      this.xSpeed += X_MOVEMENT_INFLUENCE;
      if (this.xSpeed > MAX_RUN_SPEED) this.xSpeed = MAX_RUN_SPEED;
    }

    // TODO: slow x momentum naturally
    this.xSpeed = this.xSpeed / 1.5;
    if (abs(this.xSpeed) <= BASICALLY_STOPPED) this.xSpeed = 0;

    // gravity time GO
    if (this.ySpeed === 0) {
      // can't multiply by 0, need a 'starting' speed
      this.ySpeed = settings.GRAVITY;
    } else {
      // we can multiply by gravity now
      this.ySpeed *= settings.GRAVITY;
      if (this.ySpeed > settings.MAX_Y_SPEED) this.ySpeed = settings.MAX_Y_SPEED;
    }

    // TODO: replace with tile detection, mostly here to stop never-ending fall
    if (this.y >= 150) { this.y = 150; this.ySpeed = 0; }

    // NOTE that the renderer will handle displaying these at whole pixels
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }
}