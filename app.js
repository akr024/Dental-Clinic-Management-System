require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRouter = require('./routes/routes'); 
require('./utils/authConfig');

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));


app.use(bodyParser.json());

app.use('/api/auth', authRouter);

app.use((req, res, next) => {
  res.status(404).send('Sorry, that route does not exist.');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
