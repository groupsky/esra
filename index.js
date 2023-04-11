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

export const processRunner = (callback) => {
  const ctx = new Context()
  return (event) => {
    ctx.start()
    try {
      return callback(event)
    } finally {
      ctx.stop()
    }
  }
}

export default () => {
  const processors = []
  const queuedMessages = []

  const processor = ({ topic, payload }) => {
    processors.forEach(({ topic: processorTopic, runner }) => {
      if (processorTopic === topic) {
        runner({topic, payload})
      }
    })
    return queuedMessages.splice(0)
  }

  Object.assign(processor, {
    on: (topic, callback) => {
      processors.push({ topic, runner: processRunner(callback) })
    },
    publish: (topic, payload) => {
      queuedMessages.push({ topic, payload })
    }
  })

  return processor
}
