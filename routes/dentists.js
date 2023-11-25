var express = require('express');
var router = express.Router();
var { Dentist } = require('../Models/dentistSchema');
var mqtt = require('mqtt');
var mqtt_url = process.env.CLOUDMQTT_URL || 'mqtt://test.mosquitto.org/:8883';
var client = mqtt.connect(mqtt_url);


client.on('connect', function () {
    router.post('/dentists', function (req, res) {
        const topic = 'req/POST/dentist';
        if (!req.body.username || !req.body.password || !req.body.personnummer) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        var msg = JSON.stringify(req.body);
        client.publish(topic, msg);
        res.status(200).json({ success: true }); //TODO: take data from service component?
    });
});


module.exports = router;
