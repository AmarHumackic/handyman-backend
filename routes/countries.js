const express = require('express');
const router = express.Router();
const Country = require('../models/country');

// get all countries
router.get('/', async (req, res) => {
  try {
    const country = await Country.find();
    res.json(country);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

// get country by id
router.get('/:country_id', async (req, res) => {
  try {
    const country = await Country.findById(req.params.country_id);
    res.json(country);
  } catch ({message}) {
    message.startsWith('Cast to')
      ? res.status(404).json({error: 'Country not found'})
      : res.status(500).json({error: message});
  }
});

// add country
router.post('/', async (req, res) => {
  const country = new Country({
    name: req.body.name,
    code: req.body.code,
  });
  try {
    const savedCountry = await country.save();
    res.json(savedCountry);
  } catch ({message}) {
    res.status(500).json({
      error: message,
    });
  }
});

// update country
router.patch('/:country_id', async (req, res) => {
  try {
    const updatedCountry = await Country.updateOne(
      {_id: req.params.country_id},
      {$set: {name: req.body.name, code: req.body.code}},
    );
    res.json(updatedCountry);
  } catch (err) {
    res.json({message: err});
  }
});

// delete country
router.delete('/:country_id', async (req, res) => {
  try {
    const removedCountry = await Country.remove({_id: req.params.country_id});
    res.json(removedCountry);
  } catch (err) {
    res.json({message: err});
  }
});

module.exports = router;
