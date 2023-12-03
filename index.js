import express from 'express';
import {PORT} from './config.js'
import patientPath from './routes/patientRoute.js'

const app = express();

app.use(express.json());
app.get('/', (req,res) => {
  res.send('Localhost:8080');
})

//routers for schema elements
app.use('/patients',patientPath)



    app.listen(PORT, () => {
      console.log(`App is listening on port: ${PORT}`);
    });
  