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

main()

function main() {
  const stepperOneRaf = window.requestAnimationFrame(stepperOne)
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
