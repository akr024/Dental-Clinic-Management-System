import express from 'express';
import {PORT,mongoDBURL} from './config.js'
import mongoose from 'mongoose';
import patientPath from './routes/patientRoute.js'
import appointmentPath from './routes/appointmentRoute.js'
import clinicPath from './routes/clinicRoute.js'
import reviewPath from './routes/reviewRoute.js'
const app = express();

app.use(express.json());
app.get('/', (req,res) => {
  res.send('Localhost:8080');
})

//routers for schema elements
app.use('/patients',patientPath)
app.use('/appointments',appointmentPath)
app.use('/clinics',clinicPath)
app.use('/clinics',reviewPath)


mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log('App connected to database');
    app.listen(PORT, () => {
      console.log(`App is listening on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });