// const cool = require("cool-ascii-faces");
const express = require('express');
var cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');

app.use(bodyParser.json());
app.use(cors());

// Import routes
const citiesRoute = require('./routes/cities');
const countriesRoute = require('./routes/countries');

// Middlewares
app.use('/cities', citiesRoute);
app.use('/countries', countriesRoute);

app.get('/', (req, res) => {
  res.send('Elektronicko poslovanje (Grupa 7) - backend');
});

// app.get("/cool", (req, res) => res.send(cool()));

// Connest to DB
mongoose.connect(
  process.env.MONGODB_URL,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  },
  () => {
    console.log('Connected to database');
    console.log(process.env.MONGODB_URL);
  },
);

mongoose.connection.on('error', (err) => {
  console.log('error', err);
});

// server listener
app.listen(process.env.PORT || 5000);
