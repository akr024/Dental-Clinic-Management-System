import express from 'express';
import {PORT,mongoDBURL} from './config.js'
import mongoose from 'mongoose';
const app = express();

app.use(express.json());
app.get('/', (req,res) => {
  res.send('Localhost:8080');
})

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