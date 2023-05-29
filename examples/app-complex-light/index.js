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

export default () => esra({
  light: () => {
    const state = useLightController({
      switches: ['switch1'],
      reverseSwitches: ['switch2'],
      buttons: ['button1'],
    })

    const [locked, setLocked] = useState(false)
    useInput('lock', ({ payload }) => {
      setLocked(payload)
    })

    const [doorOpen, setDoorOpen] = useState(null)
    useInput('door', ({ payload }) => {
      console.log('door', payload)
      if (payload) {
        setDoorOpen(Date.now())
      }
    })

    console.log('light state', { state, locked, doorOpen })

    if (locked) {
      return true
    }

    if (doorOpen && Date.now() - doorOpen < 1000 * 60 * 5) {
      return true
    }

    return !!state
  }
})
