import Canvas from './canvas.js';
import { loadAssets } from './loader.js';
import { beginGameLoop } from './engine.js';

let canvasObj = new Canvas(document.querySelector("body")).obj;
let gameData = {};

initialize(canvasObj, gameData);

async function initialize(canvasObj, gameData) {
  gameData.assets = await loadAssets(document);

  let bodyDOM = document.querySelector('body');

  beginGameLoop(window, canvasObj.getContext('2d', { alpha: false }), gameData.assets);
}
