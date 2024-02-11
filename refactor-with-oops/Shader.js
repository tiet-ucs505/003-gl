class Shader {
  gl

  defaultAttribDesc = {
    type: 'FLOAT',
    size: 3,
    normalized: 0,
    stride: 0,
    offset: 0,
  }

  #program
  get program() { return this.#program }

  #inputs
  get inputs() { return this.#inputs }

  use () { this.gl.useProgram(this.program) }
  unUse() { this.gl.useProgram(null) }

  constructor(gl, {
    vertexCode, fragmentCode, inputs, isDebugging
  }) {
    this.gl = gl
    this.bootstrap(
      vertexCode, fragmentCode, inputs, isDebugging
    )
  }

  bootstrap(vertexCode,
	    fragmentCode,
	    {attributes, uniforms},
	    isDebugging
	   ) {
    const gl = this.gl

    const vShader = this.compileShader(
      vertexCode, gl.VERTEX_SHADER
    )
    const fShader = this.compileShader(
      fragmentCode, gl.FRAGMENT_SHADER
    )

    if (isDebugging !== false || isDebugging !== 0)
      isDebugging = true
    this.#program = this.linkShaders(
      {vShader, fShader}, isDebugging
    )
    this.deleteShader(vShader)
    this.deleteShader(fShader)

    this.use()
    this.#inputs = {
      ...Object.fromEntries(attributes.map(
	(a) => ([a, this.aloc(a)])
      )),
      ...Object.fromEntries(uniforms.map(
	(u) => ([u, this.uloc(u)])
      ))
    }
    
    console.log({shader: {inputs: this.#inputs}})

    this.unUse()
  }

  aloc (a) {
    return this.gl
      .getAttribLocation(this.program, a)
  }
  uloc (u) {
    return this.gl
      .getUniformLocation(this.program, u)
  }

  compileShader(code, type) {
    const gl = this.gl
    type = this.sanitizeType(type)
    const shader = gl.createShader(type)
    gl.shaderSource(shader, code)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(
      shader, gl.COMPILE_STATUS
    )) {
      console.error({
	shaderCompileError: {
	  src: code,
	  glInfoLog: gl.getShaderInfoLog(shader)
	}
      })

      gl.deleteShader(shader)
    }

    return shader
  }

  sanitizeType(type) {
    return GL.sanitizeGlConst(
      this.gl, type, 'Unknown WebGL Shader Type'
    )    
  }

  sanitizeDtype(type) {
    return GL.sanitizeGlConst(
      this.gl, type, 'Unknown WebGL Data Type'
    )    
  }


  linkShaders({vShader, fShader}, isDebugging) {
    const gl = this.gl

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
    if (isDebugging) {
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

    // ----------------------------------------------------

    return shaderProgram
  }

  deleteShader(shader) {
    this.gl.deleteShader(shader);
  }

  loc(s) { return this.inputs[s] }

  setUniformValue(name, ...v) {
    const mod = 'uniform'
    return this.setInputValue(mod, name, ...v)
  }

  setAttribValue(name, ...v) {
    const mod = 'vertexAttrib'
    return this.setInputValue(mod, name, ...v)
  }

  setInputValue(mod, name, ...v) {
    if (v.length === 0)
      throw new Error('Value Required')
    const a = (Array.isArray(v[0])
	       || ArrayBuffer.isView(v[0])
	       ? 'v' : '')
    const n = (a=='v' ? v[0].length : v.length)
    const t = (v[0] instanceof Int32Array
	       ? 'i' : 'f')
    const fname = `${mod}${n}${t}${a}`
    const loc = this.loc(name)
    this.gl[fname](loc, ...v)
  }

  setAttribPointer(name, attribDesc) {
    const gl = this.gl
    const loc = this.loc(name)
    let {
      size, type, normalized, stride, offset,
    } = {
      ...this.defaultAttribDesc,
      ...attribDesc,
    }
    type = this.sanitizeDtype(type)
    console.info({enabling: {
      loc, size, type, normalized, stride, offset,
    }})
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(
      loc, size, type, normalized, stride, offset
    )
  }
}
