/**
 * @type {Map<any, Array<any>>}
 */
const contextStacks = new Map()

export function getCurrentContext(type) {
  const contextStack = contextStacks.get(type)
  if (!contextStack) {
    return undefined
  }
  return contextStack[contextStack.length - 1]
}

export function pushContext(type, context) {
  if (contextStacks.has(type)) {
    contextStacks.get(type).push(context)
  } else {
    contextStacks.set(type, [context])
  }
  context.onStart?.()
}

export function popContext(type) {
  const contextStack = contextStacks.get(type)
  if (!contextStack) {
    throw new Error(`No context stack for ${type}`)
  }
  if (contextStack.length === 0) {
    throw new Error(`No context for ${type}`)
  }

  const context = contextStack.pop()
  context.onStop?.()
}

export function useContext(type) {
  return getCurrentContext(type)
}

export function runWithContext(type, context, callback) {
  return function (...args) {
    pushContext(type, context)
    try {
      return callback(...args)
    } finally {
      popContext(type)
    }
  }
}
