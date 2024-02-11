class Buffer {
  gl
  type
  mode

  #buffer
  get id() { return this.#buffer }

  bind() {
    console.info({binding: [this.type, this.id]})
    this.gl.bindBuffer(this.type, this.id)
  }
  unbind() {
    console.info({unbinding: {}})
    this.gl.bindBuffer(this.type, null)
  }

  constructor(gl, type, data, mode='STATIC_DRAW') {
    this.gl =  gl
    this.type = this.sanitizeType(type)
    this.mode = this.sanitizeMode(mode)
    this.createBufferFromData(data)
  }

  createBufferFromData(data) {
    const gl = this.gl
    data = this.sanitizeData(data)
    this.#buffer = gl.createBuffer()
    this.bind()
    console.info({data})
    gl.bufferData(this.type, data, this.mode)
    this.unbind()
  }

  sanitizeMode(mode) {
    return GL.sanitizeGlConst(
      this.gl, mode, 'Unknown WebGL Draw Mode'
    )
  }

  sanitizeType(type) {
    return GL.sanitizeGlConst(
      this.gl, type, 'Unknown WebGL Buffer Type'
    )
  }

  sanitizeData(data) {
    if (ArrayBuffer.isView(data))
      return data
    return new this.TypedArray(data.flat())
  }

  get TypedArray() {
    const gl = this.gl
    switch(this.type) {
    case gl.BYTE		: return Int8Array
    case gl.SHORT		: return Int16Array
    case gl.UNSIGNED_BYTE	: return Uint8Array
    case gl.UNSIGNED_SHORT	: return Uint16Array
    case gl.FLOAT		: return Float32Array
    case gl.HALF_FLOAT		:
      throw new TypeError(
	'Half Float not implemented as TypedArray in javascript.'
      )
    case gl.INT			: return Int32Array
    case gl.UNSIGNED_INT	: return Uint32Array
    default			: return Float32Array
    }

    return Float32Array
  }
}
