import deepTraverse from './lib/deep-traverse.js'
import { InputContext, handleInput, runWithInput } from './lib/input-context.js'
import { runWithOutput } from './lib/output-context.js'
import { runWithState } from './lib/state-context.js'

export { useInput } from './lib/input-context.js'
export { useState } from './lib/state-context.js'

export default (computationTree) => {
  console.log('computationTree', computationTree)
  const inputContext = new InputContext()

  let recomputeQueue = []
  let outputQueue = []

  const onOutput = (topic) => (payload) => outputQueue.push({ topic, payload })

  const deepWrap = deepTraverse((computation, path) => {
    if (typeof computation !== 'function') {
      return
    }
    const id = path.join('.')
    const wrapped = runWithInput(runWithState(runWithOutput(computation, onOutput(id)), () => {
      recomputeQueue.push({ id, fn: wrapped })
    }), inputContext)
    return wrapped
  })

  const deepRun = deepTraverse((computation, path) => {
    if (typeof computation !== 'function') {
      return
    }
    return computation()
  })

  const wrapped = deepWrap(computationTree)
  const initialState = deepRun(wrapped)
  console.log('initialState', initialState)

  return (event) => {
    console.log('event', event)
    recomputeQueue = []
    outputQueue = []
    if (event) {
      handleInput(event, inputContext)
    } else {
      deepRun(wrapped)
    }
    let iteration = 10
    while (iteration > 0 && recomputeQueue.length > 0) {
      iteration--
      const queue = recomputeQueue
      recomputeQueue = []
      queue.forEach(({ id, fn }) => {
        console.log('recomputing', id)
        fn()
      })
    }
    console.log('state', deepRun(wrapped))

    return outputQueue
  }
}
