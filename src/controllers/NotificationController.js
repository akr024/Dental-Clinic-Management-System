import { subscribe } from 'mqtt-service'
import NotificationService from '../service/NotificationService.js'
import { errorHandlerDecorator } from './ErrorHandlerDecorator.js'

const TOPIC_APPOINTMENT_BOOKED = 'appointment/booked'
const TOPIC_APPOINTMENT_CANCELLED = 'appointment/cancelled'

function handleNotificationCreatePatient(topic, payload, packet) {
    const data = JSON.parse(payload.toString())
  
    NotificationService.createNotificationPatient(data)
  }

  function handleNotificationCreateDentist(topic, payload, packet) {
    const data = JSON.parse(payload.toString())
  
    NotificationService.createNotificationPatient(data)
  }

function initialize() {
  subscribe(TOPIC_APPOINTMENT_BOOKED, errorHandlerDecorator(handleNotificationCreateDentist))
  subscribe(TOPIC_APPOINTMENT_CANCELLED, errorHandlerDecorator(handleNotificationCreatePatient))

}

export default {
  initialize
}

