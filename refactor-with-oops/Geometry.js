class GlDrawable {
  gl
  bufferData
  attributes
  namedBuffers
  uniforms
  fragmentShaderCode
  vertexShaderCode

  defaultAttribDesc = {
    type: 'FLOAT',
    size: 3,
    normalized: 0,
    stride: 0,
    offset: 0,
  }

  constructor( gl,
	       buffers,
	       namedBuffers,
	       attributes,
	       uniforms,
	       fragmentShaderCode,
	       vertexShaderCode,
	     ) {
    this.gl			= gl
    this.buffers		= buffers
    this.namedBuffers		= namedBuffers
    this.attributes		= attributes
    this.uniforms		= uniforms
    this.fragmentShaderCode	= fragmentShaderCode
    this.vertexShaderCode	= vertexShaderCode

    this.bootstrap()
  }

  bootstrap() {
    const gl = this.gl

    this.#program = GL.createProgram(gl, {
      vertex: this.vertexShaderCode,
      fragment: this.fragmentShaderCode,
    })

    if (this.namedBuffers) {
      Object.entries(this.namedBuffers).forEach(
	([a, {data, desc}]) => {
	  this.bindAttribute(
	    {name: a, ...desc},
	    GL.createBuffer(gl, data)
	  )
	}
      )
    } else {
      const b = GL.createBuffer(gl, this.bufferData)
      this.attributes.forEach(
	(attribDesc) => {
	  this.bindAttribute(attribDesc, b)
	}
      )
    }
  }

  bindAttribute(attribDesc, glBuffer) {
    const gl = this.gl
    const {
      name, size, type,
      normalized, stride, offset,
    } =  {
      ...this.defaultAttribDesc,
      ...attribDesc,
    }
    const loc = this.programInputs.attribute[name]

    if (typeof type == 'string') {
      if (!gl[type])
	throw new TypeError(
	  `Invalid WebGL DataType "${type}"`
	)
      type = gl[type]
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer)
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(
      loc, size, type, normalized, stride, offset
    )
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
  }

}
