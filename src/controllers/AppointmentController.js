import { publishResponse, subscribeShared } from 'mqtt-service'
import AppointmentService from '../service/AppointmentService.js'
import { errorHandlerDecorator } from './ErrorHandlerDecorator.js'

const SUBSCRIPTION_SHARE_NAME = 'appointment_service'

const TOPIC_APPOINTMENT_CREATE = 'appointment/create'
const TOPIC_APPOINTMENT_BOOK = 'appointment/book'
const TOPIC_APPOINTMENT_CANCEL = 'appointment/cancel'
const TOPIC_APPOINTMENT_QUERY = 'appointment/query'

const RESPONSE_QOS = 1

function handleAppointmentCreate(topic, payload, packet) {
  const appointment = JSON.parse(payload.toString())

  AppointmentService.createAppointment(appointment)
    .then(response => publishResponse(packet, JSON.stringify(response), { qos: RESPONSE_QOS }))
}

function handleAppointmentCancel(topic, payload, packet) {
  const input = JSON.parse(payload.toString())

  AppointmentService.cancelAppointment(input)
    .then(response => publishResponse(packet, JSON.stringify(response), { qos: RESPONSE_QOS }))
}

function handleAppointmentBook(topic, payload, packet) {
  const input = JSON.parse(payload.toString())

  AppointmentService.bookAppointment(input)
    .then(response => publishResponse(packet, JSON.stringify(response), { qos: RESPONSE_QOS }))
}

function handleAppointmentQuery(topic, payload, packet) {
  const input = JSON.parse(payload.toString())

  AppointmentService.queryAppointments(input)
    .then(response => publishResponse(packet, JSON.stringify(response), { qos: RESPONSE_QOS }))
}

function initialize() {
  subscribeShared(SUBSCRIPTION_SHARE_NAME, TOPIC_APPOINTMENT_CREATE, errorHandlerDecorator(handleAppointmentCreate, RESPONSE_QOS))
  subscribeShared(SUBSCRIPTION_SHARE_NAME, TOPIC_APPOINTMENT_CANCEL, errorHandlerDecorator(handleAppointmentCancel, RESPONSE_QOS))
  subscribeShared(SUBSCRIPTION_SHARE_NAME, TOPIC_APPOINTMENT_BOOK, errorHandlerDecorator(handleAppointmentBook, RESPONSE_QOS))
  subscribeShared(SUBSCRIPTION_SHARE_NAME, TOPIC_APPOINTMENT_QUERY, errorHandlerDecorator(handleAppointmentQuery, RESPONSE_QOS))
}

export default {
  initialize
}
