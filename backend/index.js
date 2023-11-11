import express from 'express';
import {PORT,mongoDBURL} from './config.js'
import mongoose from 'mongoose';
import patient from './routes/patientRoute.js'
import dentist from './routes/dentistRoute.js'
const app = express();

app.use(express.json());
app.get('/', (req,res) => {
  res.send('Localhost:8080');
})

//routers for schema elements
app.use('/patients',patient)
app.use('/dentists', dentist)


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