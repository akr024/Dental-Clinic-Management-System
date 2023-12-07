import { publishResponse, subscribeShared } from 'mqtt-service'
import AppointmentService from '../service/AppointmentService.js'
import { errorHandlerDecorator } from './ErrorHandlerDecorator.js'

const SUBSCRIPTION_SHARE_NAME = 'appointment_service'

const TOPIC_APPOINTMENT_CREATE = 'appointment/create'
const TOPIC_APPOINTMENT_BOOK = 'appointment/book'

const RESPONSE_QOS = 1

function handleAppointmentCreate(topic, payload, packet) {
  const appointment = JSON.parse(payload.toString())

  AppointmentService.createAppointment(appointment)
    .then(response => publishResponse(packet, JSON.stringify(response), { qos: RESPONSE_QOS }))
}

function handleAppointmentBook(topic, payload, packet) {
  const input = JSON.parse(payload.toString())

  AppointmentService.bookAppointment(input)
    .then(response => publishResponse(packet, JSON.stringify(response), { qos: RESPONSE_QOS }))
}

function initialize() {
  subscribeShared(SUBSCRIPTION_SHARE_NAME, TOPIC_APPOINTMENT_CREATE, errorHandlerDecorator(handleAppointmentCreate, RESPONSE_QOS))
  subscribeShared(SUBSCRIPTION_SHARE_NAME, TOPIC_APPOINTMENT_BOOK, errorHandlerDecorator(handleAppointmentBook, RESPONSE_QOS))
}

export default {
  initialize
}
