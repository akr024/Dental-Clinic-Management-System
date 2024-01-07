import { Patient } from '../Models/patientSchema.js';
import {
    publishResponse,
    subscribeShared
} from 'mqtt-service';
import {
    SUBSCRIPTION_SHARE_NAME,
    patient_publish_query,
    patient_subcribe_create,
    patient_subcribe_delete
} from '../config.js';

function initialize() {
    const RESPONSE_QOS = 1

    //post patient
    subscribeShared(SUBSCRIPTION_SHARE_NAME, patient_subcribe_create, async (topic, payload, packet) => {
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
            const patientId = JSON.parse(payload.toString()).patientId;
            const patient = await Patient.findById(patientId).select('-password');

            if(!patient) {
                return { success: false, msg: 'Patient not found' }
            }

            const res = { success: true, patient: patient };
            // Publish the response
            publishResponse(packet, JSON.stringify(res), { qos: RESPONSE_QOS });
            console.log('Queried patients:', patient);
        } catch (error) {
            const msg = 'internal server error';
            publishResponse(packet, JSON.stringify({ success: false, msg }), { qos: RESPONSE_QOS });
            console.error('Error querying patients:', error);
        }
    });


    //delete patient with personummer
    subscribeShared(SUBSCRIPTION_SHARE_NAME, patient_subcribe_delete, async (topic, payload, packet) => {
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