/**
 * Loader
 */

export function loadAssets(doc) {
  return new Promise((resolve) => {
    // for now just one hardcoded block load
    let block = doc.createElement("img");

    block.addEventListener("load", function() {
      resolve(block);
    });

    block.src = './images/block.png';
  });
}