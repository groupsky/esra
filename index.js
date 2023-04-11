export default () => {
  const processors = []
  const queuedMessages = []

  const processor = ({ topic, payload }) => {
    processors.forEach(({ topic: processorTopic, callback }) => {
      if (processorTopic === topic) {
        callback({ topic, payload })
      }
    })
    return queuedMessages.splice(0)
  }

  Object.assign(processor, {
    on: (topic, callback) => {
      processors.push({ topic, callback })
    },
    publish: (topic, payload) => {
      queuedMessages.push({ topic, payload })
    }
  })

  return processor
}
