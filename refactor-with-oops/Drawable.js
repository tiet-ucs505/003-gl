class Drawable {
  gl

  // Buffers is like
  // ---------------
  // [{buf, N, attribs: {[name]: {
  //   size, type, normalized, stride, offset,
  // }}}...]
  buffers

  shader
  mode

  constructor(gl, {buffers, shader, mode}) {
    this.gl = gl
    this.buffers = buffers
    this.shader = shader
    this.mode = this.sanitizeMode(mode)
  }

  sanitizeMode(mode) {
    return GL.sanitizeGlConst(
      this.gl, mode, 'Unknown WebGL Draw Mode'
    )
  }

  setInputs(uniforms = {}, attributes = []) {
    const gl = this.gl

    // Set all uniforms, if any
    Object.entries(uniforms).forEach(
      ([name, ...v]) => {
	this.shader.setUniformValue(name, ...v)
      }
    )

    // Set attribute values, if any
    Object.entries(attributes).forEach(
      ([name, ...v]) => {
	this.shader.setAttribValue(name, ...v)
      }
    )

    // Set all attributes
    this.buffers.forEach(
      ({buf, attribs}) => {
	buf.bind()
	// Set all attributes in buffer
	Object.entries(attribs).forEach(
	  ([name, desc]) => {
	    this.shader.setAttribPointer(name, desc)
	  }
	)
	buf.unbind()
      }
    )
  }

  draw(uniforms = {}, attributes = []) {
    const gl = this.gl
    const {N} = this.buffers[0]
    this.shader.use()
    this.setInputs(uniforms, attributes)
    gl.drawArrays(this.mode, 0, N)
    // throw new Error('`draw\' : Not Implemented.')
    this.shader.unUse()
  }
}
