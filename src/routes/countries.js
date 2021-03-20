const express = require('express');
const router = express.Router();
const Country = require('../models/country');
const verifyToken = require('./verifyToken');
const {success, error} = require('../utils/responseApi');

// get all countries
router.get('/', async (req, res) => {
  try {
    const country = await Country.find();
    res.status(200).json(success('OK', country, res.statusCode));
  } catch ({message}) {
    res.status(500).json(error(message, res.statusCode));
  }
});

// get country by id
router.get('/:country_id', async (req, res) => {
  try {
    const country = await Country.findById(req.params.country_id);
    res.status(200).json(success('OK', country, res.statusCode));
  } catch ({message}) {
    message.startsWith('Cast to')
      ? res.status(404).json(error('Country not found', res.statusCode))
      : res.status(500).json(error(message, res.statusCode));
  }
});

// add country
router.post('/', verifyToken, async (req, res) => {
  const country = new Country({
    name: req.body.name,
    code: req.body.code,
  });
  try {
    const newCountry = await country.save();
    res.status(200).json(success('OK', newCountry, res.statusCode));
  } catch ({message}) {
    res.status(500).json(error(message, res.statusCode));
  }
});

// update country
router.put('/:country_id', verifyToken, async (req, res) => {
  try {
    const updatedCountry = await Country.updateOne(
      {_id: req.params.country_id},
      {$set: {name: req.body.name, code: req.body.code}},
    );
    res.status(200).json(success('OK', updatedCountry, res.statusCode));
  } catch ({message}) {
    res.status(500).json(error(message, res.statusCode));
  }
});

// delete country
router.delete('/:country_id', verifyToken, async (req, res) => {
  try {
    const deletedCountry = await Country.remove({_id: req.params.country_id});
    res.status(200).json(success('OK', deletedCountry, res.statusCode));
  } catch ({message}) {
    res.status(500).json(error(message, res.statusCode));
  }
});

module.exports = router;
