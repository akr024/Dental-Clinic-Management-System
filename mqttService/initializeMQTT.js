import { initializeMqtt } from 'mqtt-service';

const BROKER_URL = process.env.MQTT_BROKER_URL;
const PORT = process.env.MQTT_BROKER_PORT;

async function initializeMqttClient() {
    try {
        await initializeMqtt(BROKER_URL, { port: PORT });
        console.log('MQTT client initialized successfully');
    } catch (error) {
        console.error('Error initializing MQTT client:', error);
    }
}

export { initializeMqttClient };