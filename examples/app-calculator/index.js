import esra, { useInput, useState } from '../..'

export default () =>
  esra(() => {
    const [state, setState] = useState(0)

    useInput('sum', ({ payload }) => {
      console.log('onInput', payload)
      setState((sum) => {
        console.log('sum', sum, payload)
        return sum + payload
      })
    })

    console.log('state', state)
    return state
  })
