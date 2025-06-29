import { publishResponse } from "mqtt-service"

function errorHandlerDecorator(delegate, responseQos) {
  return (topic, payload, packet) => {
    try {
      delegate(topic, payload, packet)
    } catch (err) {
      console.log(err.stack)
      publishResponse(packet, JSON.stringify({ success: false, msg: 'internal server error' }, { qos: responseQos }))
    }
  }
}

export {
  errorHandlerDecorator
}
