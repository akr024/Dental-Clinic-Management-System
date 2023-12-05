import { Patient } from '../Models/patientSchema.js';
import {
    initializeMqttUsingEnvVariables,
    publish,
    publishAwaitingResponse,
    publishResponse,
    subscribe,
    subscribeShared,
    unsubscribe
} from 'mqtt-service';
import {
    SUBSCRIPTION_SHARE_NAME,
    Patient_mqtt_Pub_DELETE_Topic,
    patient_publish_query,
    patient_sub_create
} from '../config.js';

function initialize() {
    const RESPONSE_QOS = 1

    //post patient
    subscribeShared(SUBSCRIPTION_SHARE_NAME, patient_sub_create, async (topic, payload, packet) => {
        console.log('Received message:', payload.toString());

        try {
            const newPatientData = JSON.parse(payload.toString());
            const newPatient = new Patient({
                Personnummer: newPatientData.Personnummer,
                Firstname: newPatientData.Firstname,
                Lastname: newPatientData.Lastname,
                password: newPatientData.password,
                email: newPatientData.email,
            });
            const savePatient = await Patient.create(newPatient);
            const res = { success: true, patient: savePatient };
            publishResponse(packet, JSON.stringify(res), { qos: RESPONSE_QOS });
        }
        catch (error) {
            if (error.code === 11000) {
                const msg = 'Patient with the same Personnummer already exists.';
                publishResponse(packet, JSON.stringify({ success: false, msg }), { qos: RESPONSE_QOS });
                console.error('Duplicate key error. Patient with the same Personnummer already exists.');
            } else {
                const msg = 'internal server error';
                publishResponse(packet, JSON.stringify({ success: false, msg }), { qos: RESPONSE_QOS });
                console.error('Error:', error);
            }
        }
    })


    //get patient from personummer using mqtt service component
    subscribeShared(SUBSCRIPTION_SHARE_NAME, patient_publish_query, async (topic, payload, packet) => {
        try {
            const patientNummer = JSON.parse(payload.toString()).Personnummer;
            const patients = await Patient.findOne({ Personnummer: patientNummer }).select('-password');
            const res = { success: true, patient: patients };
            // Publish the response
            publishResponse(packet, JSON.stringify(res), { qos: RESPONSE_QOS });
            console.log('Queried patients:', patients);
        } catch (error) {
            const msg = 'internal server error';
            publishResponse(packet, JSON.stringify({ success: false, msg }), { qos: RESPONSE_QOS });
            console.error('Error querying patients:', error);
        }
    });


    //delete patient with personummer
    subscribeShared(SUBSCRIPTION_SHARE_NAME, Patient_mqtt_Pub_DELETE_Topic, async (topic, payload, packet) => {
        const patientNummer = JSON.parse(payload.toString()).Personnummer;
        try {
            const patients = await Patient.findOneAndDelete({ Personnummer: patientNummer }).exec();
            console.log('Deleted patient with personummer: ', patients);
        } catch (error) {
            console.error('Error ', error);
        }
    });

}

export default {
    initialize
}