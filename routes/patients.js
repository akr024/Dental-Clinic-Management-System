import express from 'express';
const router = express.Router();
import { Patient } from '../Models/patientSchema.js';
import subcriber from '../mqttService/subcriber.js';
import {
    initializeMqttUsingEnvVariables,
    publish,
    publishAwaitingResponse,
    publishResponse,
    subscribe,
    subscribeShared,
    unsubscribe
} from 'mqtt-service';
import { initializeMqttClient } from '../mqttService/initializeMQTT.js';
import { SUBSCRIPTION_SHARE_NAME, SUB_TOPIC_USER_QUERRY, Patient_mqtt_Sub_GET_Topic, Patient_mqtt_Pub_GET_Topic } from '../config.js';

const host = 'test.mosquitto.org';
const protocol = 'mqtt';
const port = 8883;
const RESPONSE_QOS = 1
const mqttClientService = initializeMqttClient()
console.log(mqttClientService)

//post patient
subcriber(host, protocol, port, `patient/Publish/POST`)
    .then(async (message) => {
        console.log('Received message:', message);
        try {
            const newPatientData = JSON.parse(message);
            const newPatient = new Patient({
                Personnummer: newPatientData.Personnummer,
                Firstname: newPatientData.Firstname,
                Lastname: newPatientData.Lastname,
                age: newPatientData.age,
                password: newPatientData.password,
                email: newPatientData.email,
            });
            Patient.create(newPatient)
                .then(createdPatient => {
                    console.log('Patient created and saved to the database:', createdPatient);
                });
        } catch (error) {
            if (error.code === 11000) {
                console.error('Duplicate key error. Patient with the same Personnummer already exists.');
            } else {
                console.error('Error:', error);
            }
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });

//get all patients using mqtt service component
subscribeShared(SUBSCRIPTION_SHARE_NAME, SUB_TOPIC_USER_QUERRY, async () => {
    console.log('Subscribed to topic: ' + SUB_TOPIC_USER_QUERRY + 'with sub share name ' + SUBSCRIPTION_SHARE_NAME)
    try {
        const patients = await Patient.find().select('-password');
        publishResponse(packet, JSON.stringify(patients));
        console.log(patients);
    } catch (error) {
        console.error('Error querying patients:', error);
    }
});

//get patient from personummer using mqtt service component
subscribeShared(SUBSCRIPTION_SHARE_NAME, SUB_TOPIC_USER_QUERRY, async (message, packet) => {
    console.log('Subscribed to topic: ' + SUB_TOPIC_USER_QUERRY + ' with sub share name ' + SUBSCRIPTION_SHARE_NAME);
    try {
        const patients = await Patient.find({ message }).select('-password');
        // Publish the response
        publishResponse(packet, JSON.stringify(patients), RESPONSE_QOS);
        console.log('Queried patients:', patients);
    } catch (error) {
        console.error('Error querying patients:', error);
    }
});

export default router;