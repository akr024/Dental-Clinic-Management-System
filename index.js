import express from 'express';
import {PORT} from './config.js'
import { initializeMqttUsingEnvVariables } from 'mqtt-service';
import appointment from './routes/appointmentRoute.js'
import clinic from './routes/clinicRoute.js'
import dentists from './routes/dentistRoute.js'
const app = express();

app.use(express.json());
app.get('/', (req,res) => {
  res.send('Localhost:8080');
})

//routers for schema elements
app.use('/appointments',appointment)
app.use('/clinics', clinic)
app.use('/dentists',dentists)

console.log('Connecting to mqt broker...')
const mqttClient = initializeMqttUsingEnvVariables()



mqttClient.on('connect', () => {
  console.log('Connected to mqtt broker')
  app.listen(PORT, () => {
    console.log(`App is listening on port: ${PORT}`);
  });
})
