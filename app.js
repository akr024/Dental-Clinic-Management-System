import { initializeMqttUsingEnvVariables } from 'mqtt-service';
//routes
import mongoose from 'mongoose';
import patientRouter from './routes/patients.js';


// Variables
var mongoURI = process.env.MONGODB_URI || 'mongodb+srv://9groupminiproject:SameGenericPass12345@cluster0.kxbdw4m.mongodb.net/?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('App connected to database at uri ' + mongoURI);

    const mqttClientService = initializeMqttUsingEnvVariables();
    mqttClientService.on('connect', () => {
      patientRouter.initialize();
    })
  })
  .catch((error) => {
    console.log(error);
  });
