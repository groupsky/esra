let currentCtx = null

class Context {
  states = []
  idx = 0

  start() {
    this.idx = 0
    currentCtx = this
  }

  stop() {
    currentCtx = null
    if (this.idx !== this.states.length) {
      throw new Error('Not all states were used')
    }
  }

  obtainState(initialState) {
    if (this.idx >= this.states.length) {
      this.states.push(initialState)
    }

    const idx = this.idx
    this.idx++
    return [
      this.states[idx],
      (newState) => {
        this.states[idx] = newState
        return newState
      }
    ]
  }

  toString() {
    return this.states.join(', ')
  }
}

export const useState = (initialState) => {
  return currentCtx.obtainState(initialState)
}

export default () => {
  const processors = []
  const queuedMessages = []

  const processor = ({ topic, payload }) => {
    processors.forEach(({ topic: processorTopic, callback, ctx }) => {
      if (processorTopic === topic) {
        ctx.start()
        try {
          callback({ topic, payload })
        } finally {
          ctx.stop()
        }
      }
    })
    return queuedMessages.splice(0)
  }

  Object.assign(processor, {
    on: (topic, callback) => {
      processors.push({ topic, callback, ctx: new Context() })
    },
    publish: (topic, payload) => {
      queuedMessages.push({ topic, payload })
    }
  })

  return processor
}
