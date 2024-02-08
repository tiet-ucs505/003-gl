main()

function main() {
  const stepperOneRaf = window.requestAnimationFrame(stepperOne)
}

function stepperOne() {
  setDomText('#valueFromStepperOne', 'hi')
}

function setDomText(sel, txt) {
  const domEl = document.querySelector(sel)
  domEl.textContent = txt
}
