// ----------------------------------------------------
// Bootstrap
// ----------------------------------------------------
const canvas = document.querySelector('#myCanvas')
const ctx = canvas.getContext('2d')
const [x0,y0,W,H] = [0, 0, canvas.width, canvas.height]
const imData = ctx.getImageData(x0,y0,W,H)
console.log({x0, y0, W, H})

// ----------------------------------------------------
// Manipulate the imData
// ----------------------------------------------------

let pixels, px, py, offset, r,g,b,a

// Retrieve Image Data as pixels
pixels = imData.data

// Pixel index
px = 87
py = 27
console.log({px, py})

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
