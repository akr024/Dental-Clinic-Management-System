import { publishResponse, subscribe } from 'mqtt-service'
import NotificationService from '../service/ClinicService.js'
import { errorHandlerDecorator } from './ErrorHandlerDecorator.js'
import { errorHandlerDecorator } from './ErrorHandlerDecorator.js'

const TOPIC_NOTIFICATION_CREATE_DENTIST = 'appointment/create'
const TOPIC_NOTIFICATION_CREATE_PATIENT = 'appointment/cancel'

const RESPONSE_QOS = 1

function handleNotificationCreateDentist(topic, payload, packet) {
  const data = JSON.parse(payload.toString())

  NotificationService.createNotificationDentist(data)
    .then(response => publishResponse(packet, JSON.stringify(response), { qos: RESPONSE_QOS }))
}

function handleNotificationCreatePatient(topic, payload, packet) {
    const data = JSON.parse(payload.toString())
  
    NotificationService.createNotificationPatient(data)
      .then(response => publishResponse(packet, JSON.stringify(response), { qos: RESPONSE_QOS }))
  }

function initialize() {
  subscribe(TOPIC_NOTIFICATION_CREATE_DENTIST, errorHandlerDecorator(handleNotificationCreateDentist, RESPONSE_QOS))
  subscribe(TOPIC_NOTIFICATION_CREATE_PATIENT, errorHandlerDecorator(handleNotificationCreatePatient, RESPONSE_QOS))
}

export default {
  initialize
}

