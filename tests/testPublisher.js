const mqtt = require('mqtt');
const client = mqtt.connect(process.env.MQTT_BROKER_URL);

client.on('connect', () => {
  console.log('Publisher connected to MQTT broker.');

  //  dummy login credentials
  const dummyLogin = {
    personnummer: '1234567890',
    password: 'testpass'
  };
  client.publish('user_auth_requests', JSON.stringify(dummyLogin), { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error('Publish error:', error);
    }
    else {
      console.log("succesfully sent the message");
    }
  });

  setTimeout(() => {
    client.end(); 
  }, 5000);});
