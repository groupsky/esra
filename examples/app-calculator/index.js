import esra, {useState} from '../..'

export default () => {
  const app = esra()

  app.on('sum', ({ topic, payload  }) => {
    const [sum, setSum] = useState(0)
    app.publish('result', setSum(sum + payload))
  })

  return app
}
