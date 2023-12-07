/* const mqtt = require('mqtt');
const client = mqtt.connect(process.env.MQTT_BROKER_URL);

client.on('connect', () => {
  console.log('MQTT Client Connected');
});

const subscribeToTopic = (topic) => {
  client.subscribe(topic, { qos: 1 }, (error) => {
    if (error) {
      console.error(`Error subscribing to topic ${topic}:`, error);
    } else {
      console.log(`Subscribed to topic ${topic}`);
    }
  });
};

const dispatchMessage = (topic, messageHandler) => {
  client.on('message', async (receivedTopic, message) => {
    if (topic === receivedTopic) {
      await messageHandler(message);
    }
  });
};

const publishAuthResult = (result, topic) => {
  client.publish(topic, JSON.stringify(result), { qos: 1 });
};

module.exports = { client, subscribeToTopic, dispatchMessage, publishAuthResult };
*/