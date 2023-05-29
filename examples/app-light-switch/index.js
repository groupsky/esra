import esra, { useInput, useState } from '../..'

const useLightController = ({ switches, reverseSwitches, buttons }) => {
  const [state, setState] = useState(null)

  switches?.forEach((switchName) => {
    useInput(switchName, ({ payload }) => {
      setState(payload)
    })
  })

  reverseSwitches?.forEach((switchName) => {
    useInput(switchName, ({ payload }) => {
      setState(!payload)
    })
  })

  buttons?.forEach((buttonName) => {
    useInput(buttonName, () => {
      setState((state) => !state)
    })
  })

  return state
}

export default () =>
  esra({
    light: () => {
      const [locked, setLocked] = useState(false)
      const state = useLightController({
        switches: ['switch1'],
        reverseSwitches: ['switch2'],
        buttons: ['button1'],
      })

      useInput('lock', ({payload}) => {
        setLocked(payload)
      })

      if (locked) {
        return true
      }
      return state
    },
  })
