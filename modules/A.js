export class A {
  s
  n
  b
  a
  ob

  #myName  = null
  get myName() {
    if (this.#myName === null)  {
      console.log('WARN: myName not initialised')
    }

    return this.#myName
  }
  set myName(s) {
    this.#myName = String(s)
  }

  constructor(s, n, b, a, ob) {
    console.log('This is from the constructor.')
    this.s = String(s)
    this.n = Number(n)
    this.b = Boolean(b)
    this.a = a
    this.ob = ob
    // this.s = s + ''
    // this.n = parseFloat(n)
  }

  get sumOfArray() {
    return this.a.reduce(
      (a,b) => (a+b),
      0
    )
  }
}

export function testA() {
  const a = new A(3, '4', 1, [6,9,4], {})
  console.log({
    sFromA: a.s,
    nFromA: a.n,
    bFromA: a.b,
    aFromA: a.a,
    obFromA: a.ob,
  })

  console.log({sumOfArrayFromA: a.sumOfArray})

  console.log({myNmaeFromA: a.myName})
  a.myName = 34

  console.log({myNmaeFromA: a.myName})
}

export default {A}
