import { subscribe } from 'mqtt-service'
import NotificationService from '../service/NotificationService.js'
import { errorHandlerDecorator } from './ErrorHandlerDecorator.js'

const TOPIC_NOTIFICATION_CREATE_DENTIST = 'appointment/booked'
const TOPIC_NOTIFICATION_CREATE_PATIENT = 'appointment/cancelled'

/*function handleNotificationDeleteAccount(topic, payload, packet) {
  const data = JSON.parse(payload.toString())

  NotificationService.createNotificationAccountDeletion(data)
}*/

function handleNotificationCreatePatient(topic, payload, packet) {
    const data = JSON.parse(payload.toString())
  
    NotificationService.createNotificationPatient(data)
  }

  function handleNotificationCreateDentist(topic, payload, packet) {
    const data = JSON.parse(payload.toString())
  
    NotificationService.createNotificationPatient(data)
  }

function initialize() {
  subscribe(TOPIC_NOTIFICATION_CREATE_DENTIST, errorHandlerDecorator(handleNotificationCreateDentist))
  subscribe(TOPIC_NOTIFICATION_CREATE_PATIENT, errorHandlerDecorator(handleNotificationCreatePatient))
  // subscribe(TOPIC_NOTIFICATION_DELETE_ACCOUNT, errorHandlerDecorator(handleNotificationDeleteAccount))

}

export default {
  initialize
}

