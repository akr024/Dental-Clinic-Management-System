import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();
import { initializeMqttUsingEnvVariables } from 'mqtt-service';
import NotificationController from './src/controllers/NotificationController.js';

const mongoURINotification = process.env.MONGO_URL_NOTIFICATION
const mongoURIEmail = process.env.MONGO_URL_EMAIL

try{
  mongoose.connect(mongoURINotification)
      .then(() => console.log('Connected to the notification database'))
      .catch(err => {
        console.error(`Failed to connect to central MongoDB with URI: ${mongoURINotification}`);
        console.error(err.stack);
        process.exit(1);
      });
} catch (err){
  console.log(err.stack)
}

let userDBConnection;

try{
  userDBConnection = mongoose.createConnection(mongoURIEmail)
    .on('connected', () => console.log('Connected to the user database'))
    .on('error', err => {
      console.error(`Failed to connect to central MongoDB with URI: ${mongoURIEmail}`);
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

export { userDBConnection };