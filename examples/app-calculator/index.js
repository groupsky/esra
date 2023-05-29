import esra, { useInput, useState } from '../..'

export default () =>
  esra({
    result: () => {
      const [state, setState] = useState(0)

      useInput('sum', ({ payload }) => {
        setState((sum) => {
          return sum + payload
        })
      })

      return state
    }
  })
