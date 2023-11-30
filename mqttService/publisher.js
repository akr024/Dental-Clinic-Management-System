var mqtt = require('mqtt');
var mqtt_url = process.env.CLOUDMQTT_URL || 'mqtt://test.mosquitto.org/:8883';
var mqttClient = mqtt.connect(mqtt_url);

publishMQTTMessage = async function (req, res) {
    try {
        const topic = res.body.topic;
        const message = res.body.message;

        console.log(`Topic: ${topic}`);
        console.log(`Message: ${message}`);

        mqttClient.publish(topic, message, {});
        res
            .status(200)
            .json({ topic, message });
    } catch (error) {
        return res.status(400).json({ status: 400, message: error.message });
    }
};

module.exports = publishMQTTMessage;
