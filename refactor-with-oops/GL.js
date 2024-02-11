class GL {

  static sanitizeGlConst(gl, name, errorMessage) {
    if (typeof name == 'string') {
      if (gl[name] === undefined)
	throw new TypeError(
	  `${errorMessage}: ${name}`
	)

      name = gl[name]
    }
    return name
  }
  
}
