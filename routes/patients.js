var express = require('express');
var router = express.Router();
var { Patient } = require('../Models/patientSchema');
var mqtt = require('mqtt');
var mqtt_url = process.env.CLOUDMQTT_URL || 'mqtt://test.mosquitto.org/:8883';
var client = mqtt.connect(mqtt_url);


module.exports = router;
