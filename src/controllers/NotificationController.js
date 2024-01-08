import { subscribe } from 'mqtt-service'
import NotificationService from '../service/NotificationService.js'
import { errorHandlerDecorator } from './ErrorHandlerDecorator.js'

const TOPIC_APPOINTMENT_BOOKED = 'appointment/booked'
const TOPIC_APPOINTMENT_CANCELLED = 'appointment/cancelled'

function handleNotificationCancel(topic, payload, packet) {
    const data = JSON.parse(payload.toString())
  
    NotificationService.createNotificationCancel(data)
  }

  function handleNotificationBook(topic, payload, packet) {
    const data = JSON.parse(payload.toString())
  
    NotificationService.createNotificationBook(data)
  }

function initialize() {
  subscribe(TOPIC_APPOINTMENT_BOOKED, errorHandlerDecorator(handleNotificationBook))
  subscribe(TOPIC_APPOINTMENT_CANCELLED, errorHandlerDecorator(handleNotificationCancel))

}

export default {
  initialize
}

