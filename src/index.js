import settings from "./settings.js";

let canvas; // necessary?

document.addEventListener('DOMContentLoaded', init, false);

function init() {
  canvas = document.createElement("canvas");
  canvas.id = "gameCanvas";
  canvas.width = 500;
  canvas.height = 500;

  let domContext = canvas.getContext('2d');
  domContext.scale(settings.pixelScale, settings.pixelScale);
  domContext.imageSmoothingEnabled = false;

  document.body.appendChild(canvas);
}