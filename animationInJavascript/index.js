const stepperOneState = {
  message: "empty",
  N: 100,
  prevRefreshTimestamp:  null,
  timestamps:  [],
  runningFillDurationAverage: 0.0,
  runningAvgFactor: 0.05,
  fillDuration: 0.0,
  fps: 0.0,
}

const stepperTwoState = {
  message: "empty",
  start: document.timeline.currentTime,
  angularSpeedRpm: 30,
}

class StepperThree {
  #startMs = null
  rotr = null
  domEl = null
  fps = null

  constructor(sel, angularSpeedRpm, phase=0.0) {
    this.domEl = document.querySelector(sel)
    this.rotr = new Rotr(angularSpeedRpm, phase)
    this.fps = new Fps(100, 0.05)
  }

  start() {
    this.#startMs = document.timeline.currentTime
  }

  step(ms) {
    this.domEl.textContent = this.message(
      this.rotr.radians(ms - this.#startMs),
      this.fps.getFps(ms - this.#startMs),
    )
  }

  get isActive() {
    return this.#startMs !== null
  }

  message(radians, fps) {
    return JSON.stringify({radians, fps}, null, 2)
  }
}

class Rotr {
  rpm
  phase
  #timePeriod

  constructor(rpm, phase = 0.0) {
    this.rpm = rpm
    this.phase = phase
    this.#timePeriod = (60000 / this.rpm)
  }

  rotations(ms) {
    const T = this.#timePeriod
    return (ms % T) / T
  }

  radians(ms) {
    return 2 * Math.PI * this.rotations(ms)
  }

}

class Fps {
  N = 100
  runningAvgFactor = 0.05

  #timestamps = []
  #runningFillDurationAverage = 0.0
  #prevRefreshTimestamp = 0.0
  #fps

  constructor(
    N = 100,
    runningAvgFactor = 0.05,
  ) {
    this.N				= N
    this.runningAvgFactor		= runningAvgFactor

    this.#runningFillDurationAverage	= 0.0
    this.#timestamps = []
    this.#prevRefreshTimestamp = 0.0

  }

  getFps(msSinceStart) {
    let fillDurationMs = 0.0

    // Push timestamp to stack
    this.#timestamps.push(msSinceStart)

    // If stack full, refresh state
    if (this.N <= this.#timestamps.length) {
      fillDurationMs = msSinceStart - this.#prevRefreshTimestamp
      this.#prevRefreshTimestamp = msSinceStart
      this.#timestamps.splice(0)

      this.#fps = 1000 / (fillDurationMs / this.N)
    }

    return Math.floor(this.#fps)
  }
}

class Clock {
  gl
  time
  // Colors RGBA
  bgColor = [1,1,1,1]		
  dialFillColor = [1,1,0.9,1]
  dialStrokeColor = [0.8,0.8,0.2,1]
  dialStrokeWidth = 1
  
  #startMs
  constructor(canvasSel, startMs, H, M, S) {
    this.initCanvas(canvasSel)
    this.time = {H,M,S}
    this.#startMs = startMs
    this.createBuffers()
    this.createProgram()
  }
  draw(ms) {
    this.resetCanvas()
    this.drawSingleWidth()
    this.drawDoubleWidth()
    this.drawQuadWidth()
  }
  initCanvas(canvasSel) {
    const canvas = document.querySelector(canvasSel)
    const {x0, y0, width: W, height: H} = canvas.getBoundingClientRect()
    canvas.width = W
    canvas.height = H
    // Get Context
    this.gl = canvas.getContext("webgl2")
    // Validate GL Context
    if (!this.gl) {
      console.error("WebGL context is not available.")
    }
  }
  
}

main()


function main() {
  const stepperOneRaf = window.requestAnimationFrame(stepperOne)

  const stepperTwoRaf = window.requestAnimationFrame(stepperTwo)

  const stepperThree = new StepperThree(
    '#valueFromStepperThree', 15
  )
  const stepperThreeFn = (ts) => {
    if (!stepperThree.isActive) stepperThree.start()
    stepperThree.step(ts)
    window.requestAnimationFrame(stepperThreeFn)
  }
  const stepperThreeRaf = window.requestAnimationFrame(stepperThreeFn)
}

function stepperOne(ts) {
  // De structure the global state
  const S = stepperOneState

  // Initialise the global state if starting
  if (S.prevRefreshTimestamp == null) {
    S.prevRefreshTimestamp = ts
    console.log({
      prevRefreshTimestamp: S.prevRefreshTimestamp
    })

    setDomText('#valueFromStepperOne',
	       JSON.stringify({message: S.message}, null, 2))

    // Request again
    window.requestAnimationFrame(stepperOne)

    return
  }

  // Or else, Process the stack.

  // Push timestamp to stack
  S.timestamps.push(ts)

  // If stack full, refresh state
  if (S.N <= S.timestamps.length) {
    S.fillDuration = ts - S.prevRefreshTimestamp
    S.prevRefreshTimestamp = ts
    if (0.0 < S.runningFillDurationAverage) {
      // This is not the first refresh, start
      // accumulating the averages
      S.runningFillDurationAverage *= 1 - S.runningAvgFactor
      S.runningFillDurationAverage += S.fillDuration * S.runningAvgFactor
    } else {
      S.runningFillDurationAverage = S.fillDuration
    }
    S.fps = 1000 * S.N / S.fillDuration

    if (0 < S.fillDuration) {
      S.message = {
	fillDuration: S.fillDuration,
	runningFillDurationAverage: S.runningFillDurationAverage,
	fps: Math.floor(S.fps),
      }

      setDomText('#valueFromStepperOne',
		 JSON.stringify({message: S.message}, null, 2))

    }

    S.timestamps.splice(0)

    
  }

  // Request again
  window.requestAnimationFrame(stepperOne)

}

function setDomText(sel, txt) {
  const domEl = document.querySelector(sel)
  domEl.textContent = txt
}

function stepperTwo(ts) {
  const S = stepperTwoState

  if (!S.tp)
    S.tp = 60000/S.angularSpeedRpm

  S.message = {
    rotation: ((ts - S.start) / S.tp) % 1
  }  

  setDomText('#valueFromStepperTwo',
	     JSON.stringify(S.message, null, 2))

  window.requestAnimationFrame(stepperTwo)
}

