import express from 'express';
import {PORT} from './config.js'
import { initializeMqttUsingEnvVariables } from 'mqtt-service';
import appointmentModel from './routes/appointment.js'
const app = express();

app.use(express.json());
app.get('/', (req,res) => {
  res.send('Localhost:8080');
})

//routers for schema elements
app.use('/appointments',appointmentModel)

console.log('Connecting to mqt broker...')
const mqttClient = initializeMqttUsingEnvVariables()



mqttClient.on('connect', () => {
  console.log('Connected to mqtt broker')
  app.listen(PORT, () => {
    console.log(`App is listening on port: ${PORT}`);
  });
})
