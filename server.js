const express = require('express');
var cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');

app.use(bodyParser.json());
app.use(cors());

// Import routes
const countriesRoute = require('./routes/countries');
const regionsRoute = require('./routes/regions');
const citiesRoute = require('./routes/cities');
const userTypesRoute = require('./routes/userTypes');
const serviceCategoriesRoute = require('./routes/serviceCategories');
const servicesRoute = require('./routes/services');
const usersRoute = require('./routes/users');

// env variables
const {MONGODB_URL, URL_PREFIX} = process.env;

// Middlewares
app.use(`${URL_PREFIX}/countries`, countriesRoute);
app.use(`${URL_PREFIX}/regions`, regionsRoute);
app.use(`${URL_PREFIX}/cities`, citiesRoute);
app.use(`${URL_PREFIX}/usertypes`, userTypesRoute);
app.use(`${URL_PREFIX}/servicecategories`, serviceCategoriesRoute);
app.use(`${URL_PREFIX}/services`, servicesRoute);
app.use(`${URL_PREFIX}/users`, usersRoute);

// app.use('/*', (req, res) => {
//   res.redirect(`${URL_PREFIX}/`);
// });

app.get(`${URL_PREFIX}`, (req, res) => {
  // res.send('Elektronicko poslovanje (Grupa 7) - API');
  // res.redirect(`${URL_PREFIX}/`);
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
