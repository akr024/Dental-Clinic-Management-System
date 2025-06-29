import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { initializeMqttUsingEnvVariables } from 'mqtt-service';

import AppointmentController from './src/controllers/AppointmentController.js';
import ClinicController from './src/controllers/ClinicController.js';
import ReviewController from './src/controllers/ReviewController.js';

dotenv.config();

const mongoURI = process.env.MONGODB_URL

mongoose.connect(mongoURI)
  .then(() => console.log('connected to mongodb'))
  .catch(err => {
    if (err) {
      console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`)
      console.error(err.stack)
      process.exit(1)
    }
    console.log(`Connected to MongoDB with URL: ${mongoURI}`)
  });

const mqttClient = initializeMqttUsingEnvVariables()

mqttClient.on('connect', () => {
  console.log('Connected to mqtt broker')

  ClinicController.initialize();
  AppointmentController.initialize();
  ReviewController.initialize();

})
