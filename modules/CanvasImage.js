import {Pixel} from '#/Pixel.js'

export class CanvasImage {
  canvasEl
  ctx
  H
  W
  #pixels = null

  constructor(canvasOrSelector) {
    this.setCanvasEl(canvasOrSelector)
    this.ctx = this.canvasEl.getContext('2d')
    this.H = this.canvasEl.height
    this.W = this.canvasEl.width
    this.#pixels = null
  }

  setCanvasEl(canvasOrSelector) {
    this.canvasEl = canvasOrSelector
    if (typeof this.canvasEl === 'string') {
      this.canvasEl =
	document.querySelector(this.canvasEl)
    }
  }

  getOffset({x,y}) {
    return 4*(this.W * y + x)
  }

  get pixels() {
    if (this.#pixels === null) {
      this.#pixels = this.ctx
	.getImageData(0,0,this.W,this.H)
    }
    return this.#pixels.data
  }

  setPixel({x,y,rgba}) {
    const offset = this.getOffset({x,y})
    this.pixels.set(rgba, offset)
  }

  flush () {
    this.ctx
      .putImageData(this.#pixels, 0, 0)
  }
}

export default {
  CanvasImage
}
