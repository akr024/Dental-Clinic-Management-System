import { subscribe } from 'mqtt-service'
import NotificationService from '../service/ClinicService.js'
import { errorHandlerDecorator } from './ErrorHandlerDecorator.js'
import { errorHandlerDecorator } from './ErrorHandlerDecorator.js'

const TOPIC_NOTIFICATION_CREATE_DENTIST = 'appointment/created'
const TOPIC_NOTIFICATION_CREATE_PATIENT = 'appointment/cancelled'

function handleNotificationCreateDentist(topic, payload, packet) {
  const data = JSON.parse(payload.toString())

  NotificationService.createNotificationDentist(data)
}

function handleNotificationCreatePatient(topic, payload, packet) {
    const data = JSON.parse(payload.toString())
  
    NotificationService.createNotificationPatient(data)
  }

function initialize() {
  subscribe(TOPIC_NOTIFICATION_CREATE_DENTIST, errorHandlerDecorator(handleNotificationCreateDentist))
  subscribe(TOPIC_NOTIFICATION_CREATE_PATIENT, errorHandlerDecorator(handleNotificationCreatePatient))
}

export default {
  initialize
}

