import { loadAssets } from './loader.js';
import { initCanvas } from './canvas.js';
import { beginGameLoop } from './engine.js';

let gameData = {};

initialize();

async function initialize() {
  gameData.assets = await loadAssets(document);

  let bodyDOM = document.querySelector('body');
  let canvasDOM = initCanvas(window, document, bodyDOM);

  beginGameLoop(window, canvasDOM.getContext('2d', { alpha: false }), gameData.assets);
}
