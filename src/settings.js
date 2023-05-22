const settings = {
  /* default amount to scale up pixels by. this will likely change when we put in
     auto-scaling based on screen size...? */
  PIXEL_SCALE: 4,

  // size of a tile's width and height (before any scaling)
  TILE_SIZE: 15, 

  // width of screen in TILES.
  SCREEN_WIDTH: 25,

  // height of screen in TILES.
  SCREEN_HEIGHT: 13,

  /* frame delay, number representing frames added between game loops.
     higher numbers make the game run slower, i.e. 1 is ~30fps, 3 is ~7.5fps.
     0 is default (probably removed after testing?) */
  FRAME_DELAY: 0,

  // universal gravity influence, applies to any sprite with weight
  GRAVITY: 1.1,

  // MAX y (falling) speed in pixels/frame, prevents any weirdness, clipping, w/e
  MAX_Y_SPEED: 8,

  // TODO, may need to add MAX_X_SPEED? but probably not yet
}

export default settings;