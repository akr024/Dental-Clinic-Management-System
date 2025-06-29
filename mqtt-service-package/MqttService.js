import dotenv from 'dotenv'
import { connect } from 'mqtt'
import crypto from 'crypto'

dotenv.config()

const DEFAULT_PROTOCOL_VERSION = 5

let mqttClient
const subscriptionHandlers = new Map()

function initializeMqttUsingEnvVariables(options = {}) {
  const BROKER_URL = process.env.MQTT_BROKER_URL
  const PORT = process.env.MQTT_BROKER_PORT

  const username = process.env.MQTT_BROKER_USERNAME
  const password = process.env.MQTT_BROKER_PASSWORD

  const certPath = process.env.MQTT_CERT_PATH
  const certKeyPath = process.env.MQTT_CERT_KEY_PATH

  return initializeMqtt(BROKER_URL, {
    ...options,
    port: PORT,
    username: username,
    password: password,
    certPath: certPath,
    keyPath: certKeyPath
  })
}

function initializeMqtt(BROKER_URL, options = {}) {
  const opts = {
    ...options,
    protocolVersion: options.protocolVersion || DEFAULT_PROTOCOL_VERSION
  }

  mqttClient = connect(BROKER_URL, opts)
  mqttClient.on('message', messageHandler)

  return mqttClient
}

function messageHandler(topic, payload, packet) {
  const handler = subscriptionHandlers.get(topic)
  if (handler) {
    handler(topic, payload, packet)
  } else {
    console.log(`Error: handler for topic ${topic} not found`)
  }
}

function subscribe(topic, handler, opts = {}) {
  subscriptionHandlers.set(topic, handler)

  mqttClient.subscribe(topic, opts)
}

/**
 * Subscribe to a topic using "Shared Subscriptions" as defined in MQTT v5 spec (4.8.2). Clients
 * subscribed to a topic with the same shareName will share the subscription and only one of 
 * those clients will receive any specific message
 */
function subscribeShared(shareName, topic, handler, opts = {}) {
  subscriptionHandlers.set(topic, handler)

  const topicString = `$share/${shareName}/${topic}`
  mqttClient.subscribe(topicString, opts)
}

function unsubscribe(topic) {
  mqttClient.unsubscribe(topic)
  subscriptionHandlers.delete(topic)
}

function publish(topic, message, opts = {}) {
  mqttClient.publish(topic, message, opts)
}

/**
 * Publish a message on a specified topic with an auto generated response topic
 * specified according to MQTT v5 spec
 */
function publishAwaitingResponse(topic, message, callback = () => { }, opts = {}) {
  const responseTopic = `${topic}/${crypto.randomUUID()}/response`
  const publishOptions = {
    ...opts,
    properties: {
      responseTopic: responseTopic
    }
  }

  subscribe(responseTopic, (topic, payload, packet) => {
    unsubscribe(responseTopic)
    callback(topic, payload, packet)
  }, opts)

  publish(topic, message, publishOptions)
}

/**
 * Publish a response to a packet that has a response topic specified according to MQTT v5 spec
 */
function publishResponse(packet, message, opts = {}) {
  const responseTopic = packet?.properties?.responseTopic

  if (!responseTopic) {
    console.log('Error! Attempting to publish a response, but packet has no response topic specified')
    return
  }

  publish(responseTopic, message, opts)
}

export {
  initializeMqtt,
  initializeMqttUsingEnvVariables,
  publish,
  publishAwaitingResponse,
  publishResponse, subscribe,
  subscribeShared,
  unsubscribe
}

