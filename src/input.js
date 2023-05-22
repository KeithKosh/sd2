/* Handles keyboard input, updates queue as necessary.
   Eventually this could handle gamepad input... */
export class Input {
  constructor() {
    this.queue = [];

    window.addEventListener('keydown', (e) => this.updateInputQueue(e), false);
    window.addEventListener('keyup', (e) => this.updateInputQueue(e), false);
  }
  
  updateInputQueue(evt) {
    let keyCode = evt.keyCode;
    if (evt.type === 'keydown') {
      if (!this.queue.includes(keyCode)) this.queue.push(keyCode);
    } else {
      if (this.queue.includes(keyCode)) this.queue.splice(this.queue.indexOf(keyCode), 1);
    }
  }
}