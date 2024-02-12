// ----------------------------------------------------
// This program
// + takes as input: pts, pointSize, bgColor;
// + 
// ----------------------------------------------------

// Variables
let r,g,b,a

// Inputs to the program
const pts = [
  // [x	, y],
  [0	, -0.5],
  [-0.5	, -0.75],
  [-0.75, -0.55],
  [-0.6	, 0.5],
  [-0.4	, 0.35],
  [0.1, 0.4],
  [0.25, 0.33],
  [0.55, 0.31],
  [0.75	, -0.6],
  [0.5	, -0.25],
]
const lines = [
  0, 1,
  0, 4,
  0, 5,
  0, 6,
  0, 9,
  1, 2,
  1, 3,
  1, 4,
  2, 3,
  3, 4,
  4, 5,
  5, 6,
  6, 7,
  7, 8,
  8, 9,
  6, 9,
  7, 9,
]
const triads = [
  0, 1, 4,
  0, 4, 5,
  0, 5, 6,
  0, 6, 9,
  1, 2, 3,
  1, 3, 4,
  9, 6, 7,
  9, 7, 8,
]
const pointSize = 50.0
const lineWidth = 2.0
const fillColorRgb = [0.95, 0.95, 0.75]
const lineColorRgb = [0.05, 0.05, 0.75]
const pointColorRgb = [0.45, 0.05, 0.05]
// const bgColor = {r:0.95,g:0.95,b:0.95,a:1}
const bgColor = [0.95,0.95,0.95]

// Other minor details
// ----------------------------------------------------
// Canvas Selector
const canvasSel = '#myCanvas'
// For Debugging
// Switch this off in production
const isLinkingValidated = true

// ----------------------------------------------------
// Main
// ----------------------------------------------------
function main(
  canvasSel,
  bgColor,
  pts,
  lines,
  triads,
  pointColorRgb,
  lineColorRgb,
  fillColorRgb,
  pointSize,
) {
  // --------------------------------------------------
  // Get And Reset Canvas
  // --------------------------------------------------
  const {canvas, gl} = getGlAndCanvas(
    canvasSel, bgColor
  )

  // --------------------------------------------------
  // Set Up Data Buffers
  // --------------------------------------------------
  // pts - [[x,y],...]
  const ptVerts = new Float32Array(
    pts.map(([x,y]) => ([x,y,0.0])).flat()
  )
  const ptBuffer = new Buffer(
    gl, gl.ARRAY_BUFFER, ptVerts, 'STATIC_DRAW'
  )

  const lineVerts = new Float32Array(
    lines.map((i) => pts[i])
      .map(([x,y]) => ([x,y,0.0]))
      .flat()
  )
  const lineBuffer = new Buffer(
    gl, gl.ARRAY_BUFFER, lineVerts, 'STATIC_DRAW'
  )

  const triVerts = new Float32Array(
    triads.map((i) => pts[i])
      .map(([x,y]) => ([x,y,0.0]))
      .flat()
  )
  const triBuffer = new Buffer(
    gl, gl.ARRAY_BUFFER, triVerts, 'STATIC_DRAW'
  )

  // --------------------------------------------------
  // Create Program
  // --------------------------------------------------
  const shader = createShader(gl)


  // --------------------------------------------------
  // Define Drawables
  // --------------------------------------------------
  const pointsDrawable = new Drawable(gl, {
    buffers: [
      {
	buf: ptBuffer,
	N: ptVerts.length / 3,
	attribs: { aPosition: {} },
      },
    ],
    shader,
    mode: gl.POINTS,
  })
  console.log({pointsDrawable})

  const linesDrawable = new Drawable(gl, {
    buffers: [
      {
	buf: lineBuffer,
	N: lineVerts.length / 3,
	attribs: { aPosition: {} },
      },
    ],
    shader,
    mode: gl.LINES,
  })
  console.log({linesDrawable})

  const triadsDrawable = new Drawable(gl, {
    buffers: [
      {
	buf: triBuffer,
	N: triVerts.length / 3,
	attribs: { aPosition: {} },
      },
    ],
    shader,
    mode: gl.TRIANGLES,
  })
  console.log({triadsDrawable})

  setupControlVariables(
    gl,
    triadsDrawable,
    linesDrawable,
    pointsDrawable,
    {
      pointSize: {
	sel: '#pointSize', val: pointSize,
      },
      lineWidth: {
	sel: '#lineWidth', val: lineWidth,
      },
      bgColor: {
	sel: '#bgColor', val: bgColor,
      },
      fillColorRgb: {
	sel: '#fillColor', val: fillColorRgb,
      },
      lineColorRgb: {
	sel: '#lineColor', val: lineColorRgb,
      },
      pointColorRgb: {
	sel: '#pointColor', val: pointColorRgb,
      },
    })

  draw(
    gl, bgColor, pointSize, lineWidth,
    triadsDrawable, fillColorRgb,
    linesDrawable, lineColorRgb,
    pointsDrawable, pointColorRgb,
  )
}

// ----------------------------------------------------
// Setup control variables from form
// ----------------------------------------------------
function getControlVariables({
  pointSize: {
    sel: pointSizeSel, val: pointSize,
  },
  lineWidth: {
    sel: lineWidthSel, val: lineWidth,
  },
  bgColor: {
    sel: bgColorSel, val: bgColor,
  },
  fillColorRgb: {
    sel: fillColorRgbSel, val: fillColorRgb,
  },
  lineColorRgb: {
    sel: lineColorRgbSel, val: lineColorRgb,
  },
  pointColorRgb: {
    sel: pointColorRgbSel, val: pointColorRgb,
  },
} = {
  // Sane Default
  pointSize: {},
  lineWidth: {},
  bgColor: {},
  fillColorRgb: {},
  lineColoRgb: {},
  pointColorRgb: {},
}) {
  pointSizeSel = pointSizeSel ?? '#pointSize'
  lineWidthSel = lineWidthSel ?? '#lineWidth'
  bgColorSel = bgColorSel ?? '#bgColor'
  fillColorRgbSel = fillColorRgbSel ?? '#fillColor'
  lineColorRgbSel = lineColorRgbSel ?? '#lineColor'
  pointColorRgbSel = pointColorRgbSel ?? '#pointColor'

  const pointSizeDomEl
	= document.querySelector(pointSizeSel)
  , lineWidthDomEl
	= document.querySelector(lineWidthSel)
  , bgColorDomEl
	= document.querySelector(bgColorSel)
  , fillColorRgbDomEl
	= document.querySelector(fillColorRgbSel)
  , lineColorRgbDomEl
	= document.querySelector(lineColorRgbSel)
  , pointColorRgbDomEl
	= document.querySelector(pointColorRgbSel)

  pointSize	= parseFloat(pointSizeDomEl.value)
  lineWidth	= parseFloat(lineWidthDomEl.value)
  bgColor	= parseAsRgbFloat(bgColorDomEl.value)
  fillColorRgb  = parseAsRgbFloat(fillColorRgbDomEl.value)
  lineColorRgb  = parseAsRgbFloat(lineColorRgbDomEl.value)
  pointColorRgb = parseAsRgbFloat(pointColorRgbDomEl.value)

  return {
    pointSize: {
      sel: pointSizeSel, val: pointSize,
    },
    lineWidth: {
      sel: lineWidthSel, val: lineWidth,
    },
    bgColor: {
      sel: bgColorSel, val: bgColor,
    },
    fillColorRgb: {
      sel: fillColorRgbSel, val: fillColorRgb,
    },
    lineColorRgb: {
      sel: lineColorRgbSel, val: lineColorRgb,
    },
    pointColorRgb: {
      sel: pointColorRgbSel, val: pointColorRgb,
    },
  }
}

function setControlVariables({
  pointSize: {
    sel: pointSizeSel, val: pointSize,
  },
  lineWidth: {
    sel: lineWidthSel, val: lineWidth,
  },
  bgColor: {
    sel: bgColorSel, val: bgColor,
  },
  fillColorRgb: {
    sel: fillColorRgbSel, val: fillColorRgb,
  },
  lineColorRgb: {
    sel: lineColorRgbSel, val: lineColorRgb,
  },
  pointColorRgb: {
    sel: pointColorRgbSel, val: pointColorRgb,
  },
} = {
  // Sane Default
  pointSize: {},
  lineWidth: {},
  bgColor: {},
  fillColorRgb: {},
  lineColoRgb: {},
  pointColoRgb: {},
}) {
  pointSizeSel = pointSizeSel ?? '#pointSize'
  lineWidthSel = lineWidthSel ?? '#lineWidth'
  bgColorSel = bgColorSel ?? '#bgColor'
  fillColorRgbSel = fillColorRgbSel ?? '#fillColor'
  lineColorRgbSel = lineColorRgbSel ?? '#lineColor'
  pointColorRgbSel = pointColorRgbSel ?? '#pointColor'

  const pointSizeDomEl
	= document.querySelector(pointSizeSel)
  , lineWidthDomEl
	= document.querySelector(lineWidthSel)
  , bgColorDomEl
	= document.querySelector(bgColorSel)
  , fillColorRgbDomEl
	= document.querySelector(fillColorRgbSel)
  , lineColorRgbDomEl
	= document.querySelector(lineColorRgbSel)
  , pointColorRgbDomEl
	= document.querySelector(pointColorRgbSel)

  pointSizeDomEl.value = pointSize
  lineWidthDomEl.value = lineWidth
  bgColorDomEl.value = rgbFloatToHex(bgColor)
  fillColorRgbDomEl.value = rgbFloatToHex(fillColorRgb)
  lineColorRgbDomEl.value = rgbFloatToHex(lineColorRgb)
  pointColorRgbDomEl.value = rgbFloatToHex(pointColorRgb)

}

function parseAsRgbFloat(rgb) {
  const r = parseInt(rgb.slice(1,3), 16) / 255
  const g = parseInt(rgb.slice(3,5), 16) / 255
  const b = parseInt(rgb.slice(5,7), 16) / 255
  return [r,g,b]
}

function rgbFloatToHex([r,g,b]) {
  r = Math.min(255, Math.max(0, r))
  r = Math.round(r * 255).toString(16)
  r = ('00' + r).slice(-2)
  g = Math.min(255, Math.max(0, g))
  g = Math.round(g * 255).toString(16)
  g = ('00' + g).slice(-2)
  b = Math.min(255, Math.max(0, b))
  b = Math.round(b * 255).toString(16)
  b = ('00' + b).slice(-2)
  return `#${r}${g}${b}`
}

function setupControlVariables(gl,
			       triadsDrawable,
			       linesDrawable,
			       pointsDrawable,
			       selectors) {
  console.log({setupControlVariables: {selectors}})

  setControlVariables(selectors)
  
  let {
    pointSize		: { sel: pointSizeSel },
    lineWidth		: { sel: lineWidthSel },
    bgColor		: { sel: bgColorSel },
    fillColorRgb	: { sel: fillColorRgbSel },
    lineColorRgb	: { sel: lineColorRgbSel },
    pointColorRgb	: { sel: pointColorRgbSel },
  } = selectors;

  
  ([
    document.querySelector(pointSizeSel)
    , document.querySelector(lineWidthSel)
    , document.querySelector(bgColorSel)
    , document.querySelector(fillColorRgbSel)
    , document.querySelector(lineColorRgbSel)
    , document.querySelector(pointColorRgbSel)
  ]).forEach((domEl) => {
    domEl.addEventListener('change', (e) => {
      let {
	pointSize	: { val: pointSize, },
	lineWidth	: { val: lineWidth, },
	bgColor		: { val: bgColor, },
	fillColorRgb	: { val: fillColorRgb, },
	lineColorRgb	: { val: lineColorRgb, },
	pointColorRgb	: { val: pointColorRgb, },
      } = getControlVariables(selectors)

      draw(
	gl, bgColor, pointSize, lineWidth,
	triadsDrawable, fillColorRgb,
	linesDrawable, lineColorRgb,
	pointsDrawable, pointColorRgb,
      )
    })
  })
  
}

// ----------------------------------------------------
// Draw
// ----------------------------------------------------
function draw (
  gl, bgColor, pointSize, lineWidth,
  triadsDrawable, fillColorRgb,
  linesDrawable, lineColorRgb,
  pointsDrawable, pointColorRgb,
) {
  clearCanvas(gl, bgColor)
  gl.lineWidth(lineWidth)
  triadsDrawable.draw({
    uPointSize: pointSize,
    uFgColorRgb: fillColorRgb,
  })
  linesDrawable.draw({
    uPointSize: pointSize,
    uFgColorRgb: lineColorRgb,
  })
  pointsDrawable.draw({
    uPointSize: pointSize,
    uFgColorRgb: pointColorRgb,
  })
}
// ----------------------------------------------------


// ----------------------------------------------------
// Clear Canvas
// ----------------------------------------------------
function clearCanvas(gl, bgColor) {
  // Set background white
  const [r,g,b] = bgColor, a=1.0
  gl.clearColor(r,g,b,a)

  // Clear Buffers
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  
}

// ----------------------------------------------------
// Create Shader
// ----------------------------------------------------
function createShader(gl) {

    const vertexCode = `# version 300 es
in vec3 aPosition;

uniform float uPointSize;
uniform vec3 uFgColorRgb;

void main(void){
  gl_PointSize = uPointSize;
  gl_Position = vec4(aPosition, 1.0);
}
`
    const fragmentCode = `# version 300 es
precision mediump float;

uniform vec3 uFgColorRgb;

out vec4 finalColor;

void main(void) {
  // vec3 fgColor = vec3(0.0, 0.0, 0.0);
  finalColor = vec4(uFgColorRgb, 1.0);
}
`
  writeTextToDomSelector(vertexCode, '#vShader code')
  writeTextToDomSelector(fragmentCode, '#fShader code')

  return new Shader(gl, {
    vertexCode,
    fragmentCode,
    inputs: {
      attributes: [
	'aPosition',
      ],
      uniforms: [
	'uPointSize',
	'uFgColorRgb',
      ]
    }
  })
  
}

// ----------------------------------------------------
// Bootstrap
// ----------------------------------------------------
function getGlAndCanvas(sel)
{
  // --------------------------------------------------
  // Get gl from canvas and reset it
  // --------------------------------------------------

  // Get Canvas
  const canvas = document.querySelector(sel)
  const {x0, y0, width: W, height: H} = canvas.getBoundingClientRect()
  canvas.width = W
  canvas.height = H

  // Get Context
  const gl = canvas.getContext("webgl2")
  // Validate GL Context
  if (!gl) {
    console.error("WebGL context is not available.")
  }

  return {canvas, gl}
  
} // --------------------------------------------------

// ----------------------------------------------------
// Utils
// ----------------------------------------------------
function writeTextToDomSelector(txt, sel) {
  const domEl = document.querySelector(sel)
  domEl.textContent = txt
}


// Execute the main
// ----------------------------------------------------
main(
  canvasSel,
  bgColor,
  pts,
  lines,
  triads,
  pointColorRgb,
  lineColorRgb,
  fillColorRgb,
  pointSize,
)
// ----------------------------------------------------
