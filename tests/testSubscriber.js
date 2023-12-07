const mqtt = require('mqtt');
const client = mqtt.connect(process.env.MQTT_BROKER_URL);

client.on('connect', () => {
  console.log('Subscriber connected to MQTT broker.');
  client.subscribe('user_auth_responses', (error) => {
    if (error) {
      console.error('Subscription error:', error);
    } else {
      console.log('Subscribes to topic');
    }
  });
});

client.end(); // Close the connection when done