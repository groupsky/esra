import { runWithContext, useContext } from './context.js'

const INPUT_CONTEXT = Symbol('input-context')

export function useInput(topic, callback) {
  const ctx = useContext(INPUT_CONTEXT)
  if (!ctx) {
    throw new Error('useInput() must be called inside runWithInput()')
  }
  ctx.registerInputHandler(topic, callback)
}

class InputContext {
  handlers = []

  registerInputHandler(topic, callback) {
    this.handlers.push({ topic, callback })
  }
}

export const runWithInput = (computation) => {
  const ctx = new InputContext()
  const withInput = runWithContext(INPUT_CONTEXT, ctx, computation)
  const handleEvent = (event) => {
    ctx.handlers.forEach(({ topic, callback }) => {
      console.log('input', event.topic, topic)
      if (topic === event.topic) {
        console.log('handling input', topic, callback)
        callback(event)
      }
    })
  }

  return [withInput, handleEvent]
}
