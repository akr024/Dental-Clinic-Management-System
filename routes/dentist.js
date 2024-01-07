import { Dentist } from '../Models/dentistSchema.js';
import {
    publishResponse,
    subscribe,
    subscribeShared,
    unsubscribe
} from 'mqtt-service';
import {
    SUBSCRIPTION_SHARE_NAME,
    TOPIC_DENTIST_CREATE,
    TOPIC_DENTIST_QUERY,
    TOPIC_DENTIST_MODIFY
} from '../config.js';

function initialize() {
    const RESPONSE_QOS = 1

    //post dentist
    subscribeShared(SUBSCRIPTION_SHARE_NAME, TOPIC_DENTIST_CREATE, async  (topic, payload, packet) => {
        console.log('Received message:', payload.toString());
        console.log("inside the subscribe method for dentist post")
        try {
            const newDentistData = JSON.parse(payload.toString());
            const newDentist = new Dentist({
                personnummer: newDentistData.personnummer,
                firstName: newDentistData.firstName,
                lastName: newDentistData.lastName,
                password: newDentistData.password,
                email: newDentistData.email,
            });
            const saveDentist = await Dentist.create(newDentist);
            const res = { success: true, dentist: saveDentist };
            publishResponse(packet, JSON.stringify(res), { qos: RESPONSE_QOS });
        }
        catch (error) {
            if (error.code === 11000) {
                const msg = 'Dentist with the same Personnummer already exists.';
                publishResponse(packet, JSON.stringify({ success: false, msg }), { qos: RESPONSE_QOS });
                console.error('Duplicate key error. Dentist with the same Personnummer already exists.');
            } else {
                const msg = 'internal server error';
                publishResponse(packet, JSON.stringify({ success: false, msg }), { qos: RESPONSE_QOS });
                console.error('Error:', error);
            }
        }
    })


    //get Dentist from personummer using mqtt service component
    subscribeShared(SUBSCRIPTION_SHARE_NAME, TOPIC_DENTIST_QUERY, async (topic, payload, packet) => {
        try {
            const dentistNummer = JSON.parse(payload.toString())._id;
            const dentists = await Dentist.findOne({ _id: dentistNummer }).select('-password');
            const res = { success: true, dentist: dentists };
            // Publish the response
            publishResponse(packet, JSON.stringify(res), { qos: RESPONSE_QOS });
            console.log('Queried dentists:', dentists);
        } catch (error) {
            const msg = 'internal server error';
            publishResponse(packet, JSON.stringify({ success: false, msg }), { qos: RESPONSE_QOS });
            console.error('Error querying dentists:', error);
        }
    });
    //modify dentist from personnummer
    subscribeShared(SUBSCRIPTION_SHARE_NAME, TOPIC_DENTIST_MODIFY,async(topic,payload,packet) => {
        try{
            const dentistNummer = JSON.parse(payload.toString())._id;
            const dentists = await Dentist.findOne({ _id: dentistNummer }).select('-password');
            if(!dentists){
                const msg = "Dentist not found";
                publishResponse(packet,JSON.stringify({success:false,msg}),{qos: RESPONSE_QOS})
                console.log("Dentist not found")
            }
            const dentistData = JSON.parse(payload.toString())
            const updateDentist = new Dentist({
                personnummer: dentists.personnummer,
                firstName: dentistData.firstName? dentistData.firstName : dentists.firstName,
                lastName: dentistData.lastName? dentistData.lastName: dentists.lastName,
                password: dentistData.password? dentistData.password:dentists.password,
                email: dentistData.email? dentistData.email:dentists.email,
            })
            const newDentist = await Dentist.create(updateDentist);
            const res = { success: true, dentist: newDentist };
            publishResponse(packet, JSON.stringify(res), { qos: RESPONSE_QOS });

        } catch(error){
            const msg = 'internal server error';
            publishResponse(packet, JSON.stringify({ success: false, msg }), { qos: RESPONSE_QOS });
            console.error('Error modifying dentists:', error);
        }
    })

}

export default {
    initialize
}