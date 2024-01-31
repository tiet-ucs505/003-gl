let r,g,b,a

// ----------------------------------------------------
// Bootstrap
// ----------------------------------------------------

// Get Canvas
const canvas = document.querySelector('#myCanvas')
console.log(canvas.getBoundingClientRect())

// Get Context
const gl = canvas.getContext("webgl2")

// Set background white
r=g=b=a=1.0
gl.clearColor(r,g,b,a)

// Clear Buffers
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)


// ----------------------------------------------------

// ----------------------------------------------------
// Shaders
// ----------------------------------------------------

// Compile Vertex Shader
// ----------------------------------------------------
const vShaderTxt = `
in vec3 a_position;

uniform float uPointSize;

void main(void){
  gl_PointSize = uPointSize;
  gl_Position = vec4(a_position, 1.0);
}
`

const vShader = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(vShader, vShaderTxt)
gl.compileShader(vShader)

if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) {
  console.error({
    shaderCompileError: {
      src: vShaderTxt,
      glInfoLog: gl.getShaderInfoLog(vShader)
    }
  })
}

// Compile Fragment Shader
// ----------------------------------------------------
const fShaderTxt = `
precision mediump float;

out vec4 finalColor;

void main(void) {
  finalColor = vec4(0.0, 0.0, 0.0, 1.0);
}
`

const fShader = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(fShader, fShaderTxt)
gl.compileShader(fShader)

if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) {
  console.error({
    shaderCompileError: {
      src: fShaderTxt,
      glInfoLog: gl.getShaderInfoLog(fShader)
    }
  })
}

// Link all the Shaders together
// ----------------------------------------------------

// For Debugging
// Switch this off in production
const doValidate = true

const shaderProgram = gl.createProgram()
gl.attachShader(shaderProgram,vShader)
gl.attachShader(shaderProgram,fShader)
gl.linkProgram(shaderProgram)

//Check if successful
if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
  console.error({
    shaderLinkingError: {
      glInfoLog: gl.getProgramInfoLog(shaderProgram)
    }
  })
  gl.deleteProgram(shaderProgram)
}

//Only do this for additional debugging.
if(doValidate) {
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
// gl.detachShader(shaderProgram,vShader);
// gl.detachShader(shaderProgram,fShader);
// gl.deleteShader(fShader);
// gl.deleteShader(vShader);

// ----------------------------------------------------

// ----------------------------------------------------
// Shader Uniforms and Attributes
// ----------------------------------------------------
// 4. Get Location of Uniforms and Attributes.
gl.useProgram(shaderProgram);
const aPositionLoc
      = gl.getAttribLocation(
	shaderProgram, "a_position"
      )

, uPointSizeLoc	= gl.getUniformLocation(
  shaderProgram,
  "uPointSize"
)
gl.useProgram(null);



// ----------------------------------------------------
// Set Up Data Buffers
// ----------------------------------------------------
const aryVerts = new Float32Array([0,0,0, 0.5,0.5,0 ]),
      bufVerts = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER,bufVerts);
gl.bufferData(gl.ARRAY_BUFFER, aryVerts, gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER,null);


// Set Up For Drawing
// ----------------------------------------------------

//Activate the Shader
gl.useProgram(shaderProgram);

// Store data to the shader's uniform variable
// uPointSize
gl.uniform1f(uPointSizeLoc,50.0);


// Tell gl which buffer we want to use at the moment
gl.bindBuffer(gl.ARRAY_BUFFER,bufVerts);
// Enable the position attribute in the shader
gl.enableVertexAttribArray(aPositionLoc);

// Set which buffer the attribute will pull its data from
gl.vertexAttribPointer(aPositionLoc,3,gl.FLOAT,false,0,0);

gl.bindBuffer(gl.ARRAY_BUFFER, null);
// Done setting up the buffer
// ----------------------------------------------------
				
// Draw the points
// ----------------------------------------------------
gl.drawArrays(gl.POINTS, 0, 2);

