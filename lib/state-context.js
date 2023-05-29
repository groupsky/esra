import { runWithContext, useContext } from './context.js'

const STATE_CONTEXT = Symbol('state-context')

export function useState(initialState) {
  const ctx = useContext(STATE_CONTEXT)

  if (!ctx) {
    throw new Error('useState() must be called inside runWithState()')
  }

  return ctx.obtainState(initialState)
}

class StateContext {
  states = []
  idx = 0
  firstRun = true
  changed = false

  constructor(onChange) {
    this.onChange = onChange
  }

  onStart() {
    this.idx = 0
    this.changed = false
  }

  onStop() {
    if (this.firstRun) {
      this.firstRun = false
      return
    }
    if (this.idx !== this.states.length) {
      throw new Error('Not all states were used')
    }
  }

  obtainState(initialState) {
    if (this.idx >= this.states.length) {
      if (this.firstRun) {
        this.states.push(initialState)
      } else {
        throw new Error('Difference in state count between runs')
      }
    }

    const idx = this.idx
    this.idx++
    return [
      this.states[idx],
      (newState) => {
        if (typeof newState === 'function') {
          newState = newState(this.states[idx])
        }
        if (this.states[idx] !== newState) {
          this.states[idx] = newState
          this.changed = true
          this.onChange()
        }
        return newState
      },
    ]
  }
}

export const runWithState = (computation, onChange) =>
  runWithContext(STATE_CONTEXT, new StateContext(onChange), computation)
