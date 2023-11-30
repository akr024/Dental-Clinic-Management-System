var mqtt = require('mqtt');
var mqtt_url = process.env.CLOUDMQTT_URL || 'mqtt://test.mosquitto.org/:8883';

function subcriber(host, protocol, port, topic) {
    const clientId = "client" + Math.random().toString(36).substring(7);

    const options = {
        keepalive: 60,
        clientId: clientId,
        protocolId: "MQTT",
        protocolVersion: 4,
        clean: true,
        reconnectPeriod: 1000,
        connectTimeout: 30 * 1000,
    };

    return new Promise((resolve, reject) => {
        var mqttClient = mqtt.connect(mqtt_url);

        mqttClient.on("connect", () => {
            console.log("Connected to MQTT broker");
            mqttClient.subscribe(topic, (err) => {
                if (!err) {
                    console.log("Subscribed to topic:", topic);
                } else {
                    reject(err);
                }
            });
        });

        mqttClient.on("message", (topic, message) => {
            // Handle received message
            const receivedMessage = message.toString();
            console.log("Received message:", receivedMessage);
            resolve(receivedMessage);
        });
    });
};

function handleReceivedMessage(message) {
    console.log("Handling the received message:", message);
};

module.exports = subcriber;
