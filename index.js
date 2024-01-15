console.log('Raghav (Not a student)')

const canvasEl = document.querySelector('#myCanvas')
const {height:H, width: W} = canvasEl
console.log({H,W})

const ctx = canvasEl.getContext('2d')

const imData = ctx.getImageData(0, 0, W, H)
console.log(
  Object.keys(imData)
)
