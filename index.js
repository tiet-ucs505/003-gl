function setPixel(px, py, canvas) {

  // ----------------------------------------------------
  // Bootstrap
  // ----------------------------------------------------
  const ctx = canvas.getContext('2d')
  const {width: W, height: H} = canvas.getBoundingClientRect()
  const [x0,y0] = [0, 0]
  console.log({x0, y0, W, H})

  const imData = ctx.getImageData(x0,y0,W,H)

  // ----------------------------------------------------
  // Manipulate the imData
  // ----------------------------------------------------

  let pixels, // px, py, 
      offset, r,g,b,a

  // Retrieve Image Data as pixels
  pixels = imData.data

  // Compute offset
  offset = (py * W + px) * 4

  // Set color
  r = g = b = a = 255
  console.log({r,g,b,a})

  // Set pixel value
  pixels.set([r,g,b,a], offset)

  // ----------------------------------------------------
  // Data Manipulation ends
  // ----------------------------------------------------


  // ----------------------------------------------------
  // Flush
  // ----------------------------------------------------
  ctx.putImageData(imData, x0, y0)
}

const canvas = document.querySelector('#myCanvas')
console.log(canvas.getBoundingClientRect())
let px, py

// Pixel index
px = 87
py = 27
console.log({px, py})

setPixel(px, py, canvas)

canvas.addEventListener('click', function(e) {
  const {x:tx, y:ty} = e.target.getBoundingClientRect()
  const px = e.clientX - tx, py = e.clientY-ty
  console.log([px, py])
  setPixel(px, py, e.target)
})
