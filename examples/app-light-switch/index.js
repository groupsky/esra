import esra, { useInput, useState } from '../..'

export default () =>
  esra({
    light: () => {
      const [state, setState] = useState(null)

      useInput('switch1', ({ payload }) => {
        setState(payload)
      })

      useInput('switch2', ({ payload }) => {
        setState(!payload)
      })

      useInput('button1', () => {
        setState((state) => !state)
      })

      return state
    },
  })
