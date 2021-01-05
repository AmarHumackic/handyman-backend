const express = require('express');
const router = express.Router();
const City = require('../models/city');
const verifyToken = require('./VerifyToken');

// all cities
router.get('/', verifyToken, async (req, res) => {
  try {
    const city = await City.find();
    res.json(city);
  } catch ({message}) {
    res.json({error: message});
  }
});

// get city by id
router.get('/:city_id', async (req, res) => {
  try {
    const city = await City.findById(req.params.city_id);
    res.json(city);
  } catch ({message}) {
    message.startsWith('Cast to')
      ? res.status(404).json({error: 'City not found'})
      : res.status(500).json({error: message});
  }
});

// add city
router.post('/', async (req, res) => {
  const city = new City({
    name: req.body.name,
    region_id: req.body.region_id,
  });
  try {
    const savedCity = await city.save();
    res.json(savedCity);
  } catch ({message}) {
    res.json({error: message});
  }
});

// update city
router.patch('/:city_id', async (req, res) => {
  try {
    const updatedCity = await City.updateOne(
      {_id: req.params.city_id},
      {$set: {name: req.body.name}},
    );
    res.json(updatedCity);
  } catch (err) {
    res.json({message: err});
  }
});

// delete city
router.delete('/:city_id', async (req, res) => {
  try {
    const removedCity = await City.remove({_id: req.params.city_id});
    res.json(removedCity);
  } catch ({message}) {
    res.json({erro: message});
  }
});

module.exports = router;
