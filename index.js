import express from 'express';
import {PORT} from './config.js'
import { initializeMqttUsingEnvVariables } from 'mqtt-service';
import appointment from './routes/appointmentRoute.js'
import clinic from './routes/clinicRoute.js'
import dentist from './routes/dentistRoute.js'
const app = express();

app.use(express.json());
app.get('/', (req,res) => {
  res.send('Localhost:8080');
})

//routers for schema elements
app.use('/appointments',appointment)
app.use('/clinics', clinic)
app.use('/dentists',dentist)

console.log('\x1b[34m%s\x1b[0m', 'Connecting to MQTT broker...');
const mqttClient = initializeMqttUsingEnvVariables()



mqttClient.on('connect', () => {
  console.log('\x1b[93m%s\x1b[0m', 'Connected to MQTT broker');
  app.listen(PORT, () => {
    console.log(`App is listening on port: \x1b[35m${PORT}\x1b[0m`);
  });
})
