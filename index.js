import cors from 'cors';
import express from 'express';
import { initializeMqttUsingEnvVariables } from 'mqtt-service';
import { PORT } from './config.js';
import clinicRouter from './routes/clinicRoute.js';
import patientRouter from './routes/patientRoute.js';

const app = express();

app.use(express.json());
app.use(cors({ origin: /.*/ }));

app.use('/patients', patientRouter)
app.use('/clinics', clinicRouter)

console.log('Connecting to mqt broker...')
const mqttClient = initializeMqttUsingEnvVariables()

mqttClient.on('connect', () => {
  console.log('Connected to mqtt broker')
  app.listen(PORT, () => {
    console.log(`App is listening on port: ${PORT}`);
  });
})
