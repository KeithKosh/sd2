/**
 * Handles adding canvas to document, as well as (TODO) handling scaling.
 */

const { min, round } = Math;

export function initCanvas(win, doc, bodyElement) {

  let canvasDOM =  _createCanvas(doc, bodyElement);

  win.addEventListener('resize', () => _resizeCanvas(win, canvasDOM));
  _resizeCanvas(win, canvasDOM);

  return canvasDOM;
}

// 1920 * 1080 / 960 * 540

function _createCanvas(doc, bodyElement) {
  let canvas = doc.createElement("canvas");
  // TODO replace with consts/props from settings JSON
  canvas.width = 272;
  canvas.height = 160;
  return bodyElement.appendChild(canvas);
}

function _resizeCanvas(win, canvasDOM) {
  canvasDOM.style.transformOrigin = "0 0";

  let scaleFactorX = win.innerWidth / canvasDOM.width;
  let scaleFactorY = win.innerHeight / canvasDOM.height;
  let scaleFactor = min(scaleFactorX, scaleFactorY);
  let offsetX = (scaleFactorY <= scaleFactorX
    ? round((win.innerWidth - (canvasDOM.width * scaleFactor)) / 2 / scaleFactor)
    : 0);
  let offsetY = (scaleFactorY > scaleFactorX
    ? round((win.innerHeight - (canvasDOM.height * scaleFactor)) / 2 / scaleFactor)
    : 0);

  let transformString = `scale(${scaleFactor}, ${scaleFactor}) translate(${offsetX}px, ${offsetY}px)`;
  canvasDOM.style.transform = transformString;
}