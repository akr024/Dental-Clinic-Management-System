function errorHandlerDecorator(delegate) {
  return (topic, payload, packet) => {
    try {
      delegate(topic, payload, packet)
    } catch (err) {
      console.log(err.stack)
    }
  }
}

export {
  errorHandlerDecorator
}

