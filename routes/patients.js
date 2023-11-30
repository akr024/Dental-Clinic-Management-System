var express = require('express');
var router = express.Router();
var { Patient } = require('../Models/patientSchema.js');
var subcriber = require('../mqttService/subcriber.js');
var publisher = require('../mqttService/publisher.js');

const host = 'test.mosquitto.org';
const protocol = 'mqtt';
const port = 8883;

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
            console.error('Error parsing JSON message:', error);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
module.exports = router;
