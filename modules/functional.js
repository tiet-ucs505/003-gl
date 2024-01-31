export function testFunctional() {
  
  // let a = []
  const a = [1,2,4,3,9,7,5,8]

  a[3] = 25

  console.log({
    double: a.map(double),
    square: a.map(square)
  })

  console.log({
    evens: a.filter(isEven),
    odds: a.filter(isOdd),
  })

  console.log({
    // acc (i+1) = acc(i) + x(i)
    sum: a.reduce(sum, 0),

    // acc (i+1) = acc(i) * x(i)
    product: a.reduce(prod, 1),
  })

  console.log({
    sumOfSquares: a.map(square).reduce(sum, 0)
  })

}

function sum(accumulated, x) {
  return accumulated + x
}
function prod(accumulated, x) {
  return accumulated * x
}

function isEven(x) {
  return (x&1) === 0
}
function isOdd(x) {
  return (x&1) !== 0
}

function double(x) {
  return 2 *x
}

function square(x) {
  return x*x
}

export default {testFunctional}

const sumOfSquares = function(seq) {
  return seq.map(square).reduce(sum, 0)
}

const sumOfSquaresByArrow = (seq) => {
  return seq.map(square).reduce(sum, 0)
}

const sumOfSquaresByArrowClosure =
      (seq) => (seq.map(square).reduce(sum, 0))
