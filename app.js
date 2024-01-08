import { initializeMqttUsingEnvVariables } from 'mqtt-service';
//routes
import mongoose from 'mongoose';
import patientController from './Controller/PatientController.js';
import dentistController from './Controller/DentistController.js';


// Variables
var mongoURI = process.env.MONGODB_URI || 'mongodb+srv://9groupminiproject:SameGenericPass12345@cluster0.kxbdw4m.mongodb.net/?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log(`App connected to \x1b[32mMONGODB\x1b[0m`);


    const mqttClientService = initializeMqttUsingEnvVariables();
    mqttClientService.on('connect', () => {
     // patientController.initialize();
      dentistController.initialize();
    })
  })
  .catch((error) => {
    console.log(error);
  });
