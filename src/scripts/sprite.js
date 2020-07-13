const { ceil, floor, round } = Math;

export default class Sprite {
  constructor(width, height, x, y, tileSize) {
    this.width = width;
    this.height = height;

    this.x = x;
    this.y = y;

    this.xM = 0;
    this.yM = 0;

    this.anchored = false;
    this.jumpLimbo = true;

    this.tileSize = tileSize;
  }

  drawSprite(context) {
    /* eventually this will handle animation, etc. based
       on momentum and internal tracking.
       instead, for now, it's a box. */
    context.fillStyle = "#CC0000";
    /* note rounding: this way we can store more precise values interally, but
      (generally) always draw everything to a whole pixel for precise graphics. */
    context.fillRect(round(this.x), round(this.y), this.width, this.height);
     
  }

  interceptingTiles(levelData, includeMomentum) {
    let addXMomentum = includeMomentum === 'x';
    let addYMomentum = includeMomentum === 'y';
    // get sprite coordinates in tileset units
    /* NOTE: momentum is always rounded UP when calculating intersects so
       small momentum values will always check the next tile over. */
    let tileStartX = floor((this.x + 
      (addXMomentum && this.xM < 0 ? ceil(this.xM) : 0)
    ) / this.tileSize);
    let tileEndX = floor((this.x + this.width - 1 + 
      (addXMomentum && this.xM > 0 ? ceil(this.xM) : 0)
    ) / this.tileSize);
    let tileStartY = floor((this.y +
      (addYMomentum && this.yM < 0 ? ceil(this.yM) : 0)
    ) / this.tileSize);
    let tileEndY = floor((this.y + this.height - 1 +
      (addYMomentum && this.yM > 0 ? ceil(this.yM) : 0)
    ) / this.tileSize); // TODO add sprite height instead of tileSize
  
    let tileArray = [];
    for (let y = tileStartY; y <= tileEndY; y++) {
      for (let x = tileStartX; x <= tileEndX; x++) {
        tileArray.push(levelData[y][x]);
      }
    }
  
    // console.log(`check from ${tileStartX},${tileStartY} to ${tileEndX},${tileEndY}: ${tileArray}`);
  
    return tileArray;
  }

  /**
   * Line up the specified edge of a sprite against a tile. This is usually due to a collision.
   */
  flushPosition(coord) {
    if (coord === 'x') {
      let oldPos = this.x + this.xM;
      let newPos = oldPos;
      // these can be re-factored and combined, but for now it's fine
      if (this.xM < 0) {
        newPos += (this.tileSize - (oldPos % this.tileSize));
      } else {
        newPos -= ((oldPos + this.width) % this.tileSize);
      }
      this.x = round(newPos);
      console.log('x is now', this.x);
    } else {
      let oldPos = this.y + this.yM;
      let newPos = oldPos;
      // ditto on the re-factoring
      if (this.yM < 0) {
        newPos += (this.tileSize - (oldPos % this.tileSize));
        //_sprite.y = round(_sprite.y + _sprite.yM + TILE_SIZE - ((_sprite.y + _sprite.yM) % TILE_SIZE));
      } else {
        newPos -= ((oldPos + this.height) % this.tileSize);
        //_sprite.y = round(_sprite.y + _sprite.yM - ((_sprite.y + _sprite.yM) % _sprite.height));
      }
      this.y = round(newPos);
     }
  }
}
