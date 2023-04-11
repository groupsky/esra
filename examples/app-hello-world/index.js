import esra from '../..'

export default () => {
  const app = esra()

  app.on('/hello', ({ topic, payload = 'world' }) => {
    app.publish(topic, `hello ${payload} from ${topic}`)
  })

  return app
}
