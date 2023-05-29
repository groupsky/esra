import esra, { useEffect, useState } from '../..'

export default () =>
  esra({
    get switch1() {
      const [state, setState] = useState(false)

      useEffect(() => {
        const timer = setTimeout(() => {
          setState((st) => !st)
        }, 1000)
        return () => clearTimeout(timer)
      }, [])

      return state
    },
    get light1() {
      return !this.switch1
    },
  })
