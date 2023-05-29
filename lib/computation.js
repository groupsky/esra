let currentContext = null

export class Context extends EventTarget {
  computation = null
  firstRun = true
  index = 0
  state = []

  constructor(computation) {
    super()
    this.computation = computation
    this.run = this.run.bind(this)
    this.destroy = this.destroy.bind(this)
  }

  run (...args) {
    this.onStart?.()
    try {
      const result = this.computation(...args)
      this.onResult?.(result)
    } catch(e) {
      e = this.onError?.(e) ?? e
      if (e) throw e
    } finally {
      this.onStop?.()
    }
    return result
  }

  destroy() {
    this.onDestroy?.()
  }

  onStart() {
    this.prevContext = currentContext
    currentContext = this

    this.index = 0
  }

  onChange() {
    this.dispatchEvent(new Event('change'))
  }

  onEffect(cleanup, effect, deps, cb) {
    cleanup()
    const result = effect.apply(null, deps)
    cb(result)
  }

  onResult(result) {
    this.state[this.index++] = result

    if (this.firstRun) {
      this.firstRun = false
    } else {
      if (this.index !== this.state.length) {
        throw new Error('Computation changed used hooks')
      }
    }
  }

  onError(e) {
    return this.prevContext?.onError?.(e)
  }

  onStop() {
    currentContext = this.prevContext
  }

  onDestroy() {
    this.state.filter(({type}) => type === 'effect').forEach(({value: {cleanup}}) => cleanup?.())
    this.state = []
  }

  obtainState(type, initialState) {
    const idx = this.index++
    if (this.firstRun) {
      this.state[idx] = {type, value: initialState}
    } else {
      if (!this.state[idx]) {
        throw new Error('Computation changed used hooks')
      }
      if (this.state[idx].type !== type) {
        throw new Error('Computation changed used hooks')
      }
    }

    return [this.state[idx], (value) => {
      if (typeof value === 'function') {
        value = value(this.state[idx].value)
      }
      this.state[idx].value = value
      this.onChange?.()
    }]
  }

  registerEffect(cb, deps) {
    const [{deps: oldDeps, cleanup: oldCleanup}, setState] = this.obtainState('effect', {deps, cleanup: null})

    let hasChanged = true;

    if (!this.firstRun && oldDeps) {
      // checking if the old dependencies are different from older dependencies
      hasChanged = deps.some((d, index) => !Object.is(d, oldDeps[index]));
    }

    if (hasChanged) {
      this.onEffect?.(oldCleanup, cb, deps, (cleanup) => {
        setState({deps, cleanup})
      })
    }
  }
}

export function useState(initialState) {
  return currentContext.obtainState('state', initialState)
}

export function useEffect(cb, deps) {
  currentContext.registerEffect(cb, deps)
}
