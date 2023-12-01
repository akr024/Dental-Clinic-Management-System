import { publishResponse, subscribeShared } from 'mqtt-service'
import ClinicService from '../service/ClinicService.js'

const SUBSCRIPTION_SHARE_NAME = 'appointment_service'

const TOPIC_CLINIC_CREATE = 'clinic/create'
const TOPIC_CLINIC_QUERY = 'clinic/query'

const RESPONSE_QOS = 1

function handleClinicCreate(topic, payload, packet) {
  const clinic = JSON.parse(payload.toString())

  ClinicService.createClinic(clinic)
    .then(response => publishResponse(packet, JSON.stringify(response), { qos: RESPONSE_QOS }))
    .catch(err => handleError(err, packet))
}

function handleClinicQuery(topic, payload, packet) {
  // For now just get all, later when search functionallity is
  // added based on time some query params can be added here
  ClinicService.queryClinics()
    .then(response => publishResponse(packet, JSON.stringify(response), { qos: RESPONSE_QOS }))
    .catch(err => handleError(err, packet))
}

function handleError(err, packet) {
  console.log(err.stack)
  publishResponse(packet, JSON.stringify({ success: false, msg: 'internal server error' }, { qos: RESPONSE_QOS }))
}

function initialize() {
  subscribeShared(SUBSCRIPTION_SHARE_NAME, TOPIC_CLINIC_CREATE, handleClinicCreate)
  subscribeShared(SUBSCRIPTION_SHARE_NAME, TOPIC_CLINIC_QUERY, handleClinicQuery)
}

export default {
  initialize
}