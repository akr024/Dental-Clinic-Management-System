import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();
import { initializeMqttUsingEnvVariables } from 'mqtt-service';
import NotificationController from './src/controllers/NotificationController.js';

const mongoURI = process.env.MONGO_URL

try{
  mongoose.connect(mongoURI)
      .then(() => console.log('Connected to the central database'))
      .catch(err => {
        console.error(`Failed to connect to central MongoDB with URI: ${mongoURI}`);
        console.error(err.stack);
        process.exit(1);
      });
} catch (err){
  console.log(err.stack)
} 

const mqttClient = initializeMqttUsingEnvVariables()

mqttClient.on('connect', () => {
  console.log('Connected to mqtt broker')

  NotificationController.initialize()
})