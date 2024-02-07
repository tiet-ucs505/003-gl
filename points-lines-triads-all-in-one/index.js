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
const bgColor = {r:0.95,g:0.95,b:0.95,a:1}

// Vertex Shader Text
// ----------------------------------------------------
const vShaderTxt = `# version 300 es
in vec3 a_position;

uniform float uPointSize;
uniform vec3 uFgColorRgb;

void main(void){
  gl_PointSize = uPointSize;
  gl_Position = vec4(a_position, 1.0);
}
`

// Fragment Shader Text
// ----------------------------------------------------
const fShaderTxt = `# version 300 es
precision mediump float;

uniform vec3 uFgColorRgb;

out vec4 finalColor;

void main(void) {
  // vec3 fgColor = vec3(0.0, 0.0, 0.0);
  finalColor = vec4(uFgColorRgb, 1.0);
}
`

// Other minor details
// ----------------------------------------------------
// Canvas Selector
const canvasSel = '#myCanvas'
// For Debugging
// Switch this off in production
const isLinkingValidated = true

// Execute the main
// ----------------------------------------------------
main(canvasSel,
     bgColor,
     pts,
     lines,
     triads,
     pointColorRgb,
     lineColorRgb,
     fillColorRgb,
     pointSize,
     vShaderTxt,
     fShaderTxt,
     isLinkingValidated
    )
// ----------------------------------------------------

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
  vShaderTxt,
  fShaderTxt,
  isLinkingValidated
) {
  // ----------------------------------------------------
  // Get And Reset Canvas
  // ----------------------------------------------------
  const {canvas, gl} = getGlAndResetCanvas(canvasSel, bgColor)


  // ----------------------------------------------------
  // Set Up Data Buffers
  // ----------------------------------------------------
  // pts - [[x,y],...]
  const ptVerts = new Float32Array(
    pts.map(([x,y]) => ([x,y,0.0])).flat()
  )

  const bufPtVerts = createBufferFromData(
    gl, gl.ARRAY_BUFFER,
    ptVerts,
    gl.STATIC_DRAW
  )

  const lineVerts = new Float32Array(
    lines.map((i) => pts[i])
      .map(([x,y]) => ([x,y,0.0]))
      .flat()
  )
  const bufLineVerts = createBufferFromData(
    gl, gl.ARRAY_BUFFER,
    lineVerts,
    gl.STATIC_DRAW
  )

  const triVerts = new Float32Array(
    triads.map((i) => pts[i])
      .map(([x,y]) => ([x,y,0.0]))
      .flat()
  )
  const bufTriVerts = createBufferFromData(
    gl, gl.ARRAY_BUFFER,
    triVerts,
    gl.STATIC_DRAW
  )


  // ----------------------------------------------------
  // Create Program
  // ----------------------------------------------------
  // For clarity
  writeTextToDomSelector(vShaderTxt, '#vShader code')
  writeTextToDomSelector(fShaderTxt, '#fShader code')
  const vShader = compileShader(gl, vShaderTxt, gl.VERTEX_SHADER)
  const fShader = compileShader(gl, fShaderTxt, gl.FRAGMENT_SHADER)
  const shaderProgram = linkShaders(
    gl, vShader, fShader, isLinkingValidated
  )

  // ----------------------------------------------------
  // Extract Program Pointers
  // ----------------------------------------------------
  gl.useProgram(shaderProgram);
  const aPositionLoc
	= gl.getAttribLocation(
	  shaderProgram, "a_position"
	)
  , uPointSizeLoc	= gl.getUniformLocation(
    shaderProgram,
    "uPointSize"
  )
  , uFgColorRgbLoc	= gl.getUniformLocation(
    shaderProgram,
    "uFgColorRgb"
  )
  gl.useProgram(null);

  // ----------------------------------------------------
  // Bind Program Pointers to Data Buffers
  // ----------------------------------------------------

  //Activate the Shader
  gl.useProgram(shaderProgram);

  // Uniforms
  // ----------------------------------------------------
  // Store data to the shader's uniform variable
  // uPointSize
  gl.uniform1f(uPointSizeLoc, pointSize);


  // --------------------------------------------------
  // Draw Triads
  // --------------------------------------------------
  gl.uniform3fv(uFgColorRgbLoc, new Float32Array(fillColorRgb));

  // Attributes
  // ----------------------------------------------------
  // Tell gl which buffer we want to use at the moment
  gl.bindBuffer(gl.ARRAY_BUFFER, bufTriVerts);
  // Enable the position attribute in the shader
  gl.enableVertexAttribArray(aPositionLoc);

  // Set which buffer the attribute will pull its data from
  gl.vertexAttribPointer(aPositionLoc,3,gl.FLOAT,false,0,0);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  // Done setting up the buffer -----------------------
  
  // Draw the points
  // ----------------------------------------------------
  // gl.drawArrays(gl.POINTS, 0, 3);
  // gl.drawArrays(gl.LINES, 0, 2);
  // gl.drawArrays(gl.LINE_STRIP, 0, 3);
  // gl.drawArrays(gl.LINE_LOOP, 0, 3);
  gl.drawArrays(gl.TRIANGLES, 0, triVerts.length/3);
  // gl.drawArrays(gl.TRIANGLE_STRIP, 0, 5);
  // gl.drawArrays(gl.TRIANGLE_FAN, 0, 5);
  // --------------------------------------------------

  // --------------------------------------------------
  // Draw Lines
  // --------------------------------------------------
  gl.uniform3fv(uFgColorRgbLoc, new Float32Array(lineColorRgb));

  // Attributes
  // ----------------------------------------------------
  // Tell gl which buffer we want to use at the moment
  gl.bindBuffer(gl.ARRAY_BUFFER, bufLineVerts);
  // Enable the position attribute in the shader
  gl.enableVertexAttribArray(aPositionLoc);

  // Set which buffer the attribute will pull its data from
  gl.vertexAttribPointer(aPositionLoc,3,gl.FLOAT,false,0,0);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  // Done setting up the buffer -----------------------
  
  // Draw the points
  // ----------------------------------------------------
  // gl.drawArrays(gl.POINTS, 0, 3);
  gl.drawArrays(gl.LINES, 0, lineVerts.length/3);
  // gl.drawArrays(gl.LINE_STRIP, 0, 3);
  // gl.drawArrays(gl.LINE_LOOP, 0, 3);
  // gl.drawArrays(gl.TRIANGLES, 0, 3);
  // gl.drawArrays(gl.TRIANGLE_STRIP, 0, 5);
  // gl.drawArrays(gl.TRIANGLE_FAN, 0, 5);
  // --------------------------------------------------

  // --------------------------------------------------
  // Draw Points
  // --------------------------------------------------
  gl.uniform3fv(uFgColorRgbLoc, new Float32Array(pointColorRgb));

  // Attributes
  // ----------------------------------------------------
  // Tell gl which buffer we want to use at the moment
  gl.bindBuffer(gl.ARRAY_BUFFER, bufPtVerts);
  // Enable the position attribute in the shader
  gl.enableVertexAttribArray(aPositionLoc);

  // Set which buffer the attribute will pull its data from
  gl.vertexAttribPointer(aPositionLoc,3,gl.FLOAT,false,0,0);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  // Done setting up the buffer -----------------------
  
  // Draw the points
  // ----------------------------------------------------
  gl.drawArrays(gl.POINTS, 0, ptVerts.length/3);
  // gl.drawArrays(gl.LINES, 0, 2);
  // gl.drawArrays(gl.LINE_STRIP, 0, 3);
  // gl.drawArrays(gl.LINE_LOOP, 0, 3);
  // gl.drawArrays(gl.TRIANGLES, 0, 3);
  // gl.drawArrays(gl.TRIANGLE_STRIP, 0, 5);
  // gl.drawArrays(gl.TRIANGLE_FAN, 0, 5);
  // --------------------------------------------------



}

// ----------------------------------------------------
// Bootstrap
// ----------------------------------------------------
function getGlAndResetCanvas(sel, bgColor={a:0})
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

  // Set background white
  const {r,g,b,a} = bgColor
  gl.clearColor(r,g,b,a)

  // Clear Buffers
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  return {canvas, gl}

  // --------------------------------------------------
}

// ----------------------------------------------------
// Shaders
// ----------------------------------------------------
function compileShader(gl, shaderTxt, shaderType) {
  // Compile Shader
  // ----------------------------------------------------
  const shader = gl.createShader(shaderType)
  gl.shaderSource(shader, shaderTxt)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error({
      shaderCompileError: {
	src: shaderTxt,
	glInfoLog: gl.getShaderInfoLog(shader)
      }
    })

    gl.deleteShader(shader)
  }

  return shader
}

function linkShaders(gl, vShader, fShader, doValidate) {
  // Link all the Shaders together
  // ----------------------------------------------------

  const shaderProgram = gl.createProgram()
  gl.attachShader(shaderProgram,vShader)
  gl.attachShader(shaderProgram,fShader)
  gl.linkProgram(shaderProgram)

  //Check if successful
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
    console.error({
      shaderLinkingError: {
	glInfoLog: gl.getProgramInfoLog(shaderProgram)
      }
    })
    gl.deleteProgram(shaderProgram)
  }

  //Only do this for additional debugging.
  if (doValidate) {
    gl.validateProgram(shaderProgram)
    if(!gl.getProgramParameter(shaderProgram,gl.VALIDATE_STATUS)){
      console.error({
	shaderValidationError: {
	  glInfoLog: gl.getProgramInfoLog(shaderProgram)
	}
      })
      gl.deleteProgram(shaderProgram)
    }
  }

  // Can delete the shaders since the program has been
  // made.
  // ----------------------------------------------------
  // TODO, detaching might cause issues on some browsers,
  // Might only need to delete.
  gl.detachShader(shaderProgram,vShader);
  gl.detachShader(shaderProgram,fShader);
  gl.deleteShader(fShader);
  gl.deleteShader(vShader);

  // ----------------------------------------------------

  return shaderProgram
}

// ----------------------------------------------------
// Buffers
// ----------------------------------------------------
function createBufferFromData(gl, bufType, data, drawMode) {
  const buffer = gl.createBuffer();

  gl.bindBuffer(bufType, buffer);
  gl.bufferData(bufType, data, drawMode);
  gl.bindBuffer(bufType, null);

  return buffer
}

// ----------------------------------------------------
// Utils
// ----------------------------------------------------
function writeTextToDomSelector(txt, sel) {
  const domEl = document.querySelector(sel)
  domEl.textContent = txt
}
