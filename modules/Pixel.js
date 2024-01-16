export class Pixel {
  x
  y
  r
  g
  b
  a
  
  constructor(x, y, r, g, b, a) {
    const Cls = this.constructor
    this.x = Cls.asUint8(x)
    this.y = Cls.asUint8(y)
    this.r = Cls.asUint8(r)
    this.g = Cls.asUint8(g)
    this.b = Cls.asUint8(b)
    this.a = Cls.asUint8(a)
  }

  static asUint8(a) {
    return Math.min(255, Math.max(0, a << 0))
  }

  get rgba() {
    return [this.r,this.g,this.b,this.a]
  }
}

export default {Pixel}
