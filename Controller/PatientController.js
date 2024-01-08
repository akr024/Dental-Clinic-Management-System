import { publishResponse,subscribeShared } from "mqtt-service";
import PatientService from '../service/PatientService.js'
import {patient_subcribe_create,patient_publish_query,patient_subcribe_delete,SUBSCRIPTION_SHARE_NAME} from '../config.js'
import { errorHandlerDecorator } from './ErrorHandlerDecorator.js'

const RESPONSE_QOS = 1

function handlePatientCreate(topic, payload, packet) {
    const patient = JSON.parse(payload.toString())
  
    PatientService.createPatient(patient)
      .then(response => publishResponse(packet, JSON.stringify(response), { qos: RESPONSE_QOS }))
  }
  
  function handlePatientQuery(topic, payload, packet) {
    const input = JSON.parse(payload.toString())
  
    PatientService.queryPatients(input)
      .then(response => publishResponse(packet, JSON.stringify(response), { qos: RESPONSE_QOS }));
  }
  function handlePatientDelete(topic, payload, packet) {
    const input = JSON.parse(payload.toString())
  
    PatientService.deletePatient(input)
      .then(response => publishResponse(packet, JSON.stringify(response), { qos: RESPONSE_QOS }))
  }
  
  
  
  function initialize() {
    subscribeShared(SUBSCRIPTION_SHARE_NAME, patient_subcribe_create, errorHandlerDecorator(handlePatientCreate, RESPONSE_QOS))
    subscribeShared(SUBSCRIPTION_SHARE_NAME, patient_subcribe_delete, errorHandlerDecorator(handlePatientDelete, RESPONSE_QOS))
    subscribeShared(SUBSCRIPTION_SHARE_NAME, patient_publish_query, errorHandlerDecorator(handlePatientQuery, RESPONSE_QOS))
    
  }
  
  export default {
    initialize
  }
  