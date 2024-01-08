import { publishResponse,subscribeShared } from "mqtt-service";
import DentistService from '../service/DentistService.js'
import {TOPIC_DENTIST_CREATE,TOPIC_DENTIST_QUERY,TOPIC_DENTIST_MODIFY,SUBSCRIPTION_SHARE_NAME} from '../config.js'
import { errorHandlerDecorator } from './ErrorHandlerDecorator.js'

const RESPONSE_QOS = 1

function handleDentistCreate(topic, payload, packet) {
    const dentist = JSON.parse(payload.toString())
  
    DentistService.createDentist(dentist)
      .then(response => publishResponse(packet, JSON.stringify(response), { qos: RESPONSE_QOS }))
  }
  
  function handleDentistQuery(topic, payload, packet) {
    const dentist = JSON.parse(payload.toString())
  
    DentistService.queryDentists(dentist)
      .then(response => publishResponse(packet, JSON.stringify(response), { qos: RESPONSE_QOS }));
  }
  function handleDentistModify(topic, payload, packet) {
    const dentist = JSON.parse(payload.toString())
  
    DentistService.modifyDentist(dentist)
      .then(response => publishResponse(packet, JSON.stringify(response), { qos: RESPONSE_QOS }))
  }
  
  
  
  function initialize() {
    subscribeShared(SUBSCRIPTION_SHARE_NAME, TOPIC_DENTIST_CREATE, errorHandlerDecorator(handleDentistCreate, RESPONSE_QOS))
    subscribeShared(SUBSCRIPTION_SHARE_NAME, TOPIC_DENTIST_MODIFY, errorHandlerDecorator(handleDentistModify, RESPONSE_QOS))
    subscribeShared(SUBSCRIPTION_SHARE_NAME, TOPIC_DENTIST_QUERY, errorHandlerDecorator(handleDentistQuery, RESPONSE_QOS))
    
  }
  
  export default {
    initialize
  }
  