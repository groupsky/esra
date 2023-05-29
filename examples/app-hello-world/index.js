import esra, { useInput, useState } from '../..'

export default () => esra({
  '/hello': () => {
    const [input, setInput] = useState(null)

    useInput('/hello', (event) => {
      setInput(event)
    })

    if (!input) return null

    return `hello ${input.payload} from ${input.topic}`
  }
})
