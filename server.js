const express = require('express');
var cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const path = require('path');
require('dotenv/config');

app.use(bodyParser.json());
app.use(cors());

// Import routes
const countriesRoute = require('./src/routes/countries');
const regionsRoute = require('./src/routes/regions');
const citiesRoute = require('./src/routes/cities');
const userTypesRoute = require('./src/routes/userTypes');
const serviceCategoriesRoute = require('./src/routes/serviceCategories');
const servicesRoute = require('./src/routes/services');
const usersRoute = require('./src/routes/users');
const serviceRequestsRoute = require('./src/routes/serviceRequests');

// env variables
const {MONGODB_URL, URL_PREFIX} = process.env;

// Middlewares
app.use(`${URL_PREFIX}/countries`, countriesRoute);
app.use(`${URL_PREFIX}/regions`, regionsRoute);
app.use(`${URL_PREFIX}/cities`, citiesRoute);
app.use(`${URL_PREFIX}/usertypes`, userTypesRoute);
app.use(`${URL_PREFIX}/service-categories`, serviceCategoriesRoute);
app.use(`${URL_PREFIX}/services`, servicesRoute);
app.use(`${URL_PREFIX}/users`, usersRoute);
app.use(`${URL_PREFIX}/service-requests`, serviceRequestsRoute);

app.use('/uploads', express.static('uploads')); // Make uploads folder public - accessible via URL

app.get(`${URL_PREFIX}`, (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Connest to DB
mongoose.connect(
  MONGODB_URL,
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
