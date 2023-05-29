import { runWithInput } from './lib/input-context.js'
import { runWithState } from './lib/state-context.js'

export { useInput, runWithInput } from './lib/input-context.js'
export { useState, runWithState } from './lib/state-context.js'

export default (computation) => {
  let recompute = false

  const withState = runWithState(computation, () => {
    console.log('recompute')
    recompute = true
  })

  const [withInput, handleEvent] = runWithInput(withState)

  const wrappedComputation = withInput

  let state = wrappedComputation()

  return (event) => {
    console.log('event', event)
    handleEvent(event)
    while (recompute) {
      console.log('recomputing')
      recompute = false
      state = wrappedComputation()
    }
    return [{ topic: 'result', payload: state }]
  }
}
