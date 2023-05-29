import { runWithContext, useContext } from './context.js'

const INPUT_CONTEXT = Symbol('input-context')

export function useInput(topic, callback) {
  const ctx = useContext(INPUT_CONTEXT)
  if (!ctx) {
    throw new Error('useInput() must be called inside runWithInput()')
  }
  ctx.registerInputHandler(topic, callback)
}

export class InputContext {
  handlers = []

  registerInputHandler(topic, callback) {
    if (this.handlers.some((handler) => handler.topic === topic)) {
      return
    }
    this.handlers.push({ topic, callback })
  }
}

export const runWithInput = (computation, ctx) => runWithContext(INPUT_CONTEXT, ctx, computation)

export const handleInput = (event, ctx) =>
  ctx.handlers.forEach(({ topic, callback }) => {
    if (topic === event.topic) {
      callback(event)
    }
  })
