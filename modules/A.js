export class A {
  s
  n
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

  sumOfArray() {
    return this.a.reduce(
      (a,b) => (a+b),
      0
    )
  }
}

export function testA() {
  const a = new A(3, '4', 1, [], {})
  console.log({
    sFromA: a.s,
    nFromA: a.n,
    bFromA: a.b,
    aFromA: a.a,
    obFromA: a.ob,
  })

  console.log(a.sumOfArray())
}

export default {A}
