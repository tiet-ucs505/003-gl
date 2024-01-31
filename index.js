import {CanvasImage} from '#/CanvasImage.js'
import {Pixel} from '#/Pixel.js'
import {testA} from '#/A.js'
import {testFunctional} from '#/functional.js'

function docReady (fn) {
  if (document.readyState === 'complete' ||
      document.readyState === 'interactive') {
    setTimeout(fn, 1)
  } else {
    document.addEventListener('DOMContentLoaded', fn)
  }
}

function main () {
  
  console.log('Raghav (Not a student)')

  const canvasEl = document.querySelector('#myCanvas')
  const {height:H, width: W} = canvasEl
  // const obj = {
  //   H: H,
  //   W: W
  // }
  // console.log(obj)
  console.log({H,W})

  const ctx = canvasEl.getContext('2d')

  const imData = ctx.getImageData(0, 0, W, H)
  console.log({imDataKeys: Object.keys(imData)})

  const canvas = new CanvasImage('#myCanvas')
  console.log(canvas)

  const pixel = new Pixel(102,45,255,255,255,255)
  console.log(pixel)

  canvas.setPixel(pixel)

  pixel.x = 103
  pixel.y = 46
  canvas.setPixel(pixel)

  canvas.flush()

  // testA()
  // testFunctional()
}

docReady(main)
