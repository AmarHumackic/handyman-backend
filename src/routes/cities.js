const express = require('express');
const router = express.Router();
const City = require('../models/city');
const Region = require('../models/region');
const verifyToken = require('./verifyToken');
const {success, error} = require('../utils/responseApi');

// all cities
router.get('/', async (req, res) => {
  try {
    const {withRegions} = req.query;
    if (withRegions === '1' || withRegions === 1) {
      const regions = await Region.find(); // use lean() for faster queries
      const cities = await City.find(); // use lean() for faster queries
      res.status(200).json(success('OK', {regions, cities}, res.statusCode));
    } else {
      const city = await City.find();
      res.status(200).json(success('OK', {city}, res.statusCode));
    }
  } catch ({message}) {
    res.status(500).json(error(message, res.statusCode));
  }
});

// get city by id
router.get('/:city_id', async (req, res) => {
  try {
    const city = await City.findById(req.params.city_id);
    res.status(200).json(success('OK', {city}, res.statusCode));
  } catch ({message}) {
    message.startsWith('Cast to')
      ? res.status(404).json(error('City not found', res.statusCode))
      : res.status(500).json(error(message, res.statusCode));
  }
});

// add city
router.post('/', verifyToken, async (req, res) => {
  const city = new City({
    name: req.body.name,
    region_id: req.body.region_id,
  });
  try {
    const newCity = await city.save();
    res.status(200).json(success('OK', {newCity}, res.statusCode));
  } catch ({message}) {
    res.status(500).json(error(message, res.statusCode));
  }
});

// update city
router.patch('/:city_id', verifyToken, async (req, res) => {
  try {
    const updatedCity = await City.updateOne(
      {_id: req.params.city_id},
      {$set: {name: req.body.name}},
    );
    res.status(200).json(success('OK', {updatedCity}, res.statusCode));
  } catch ({message}) {
    res.status(500).json(error(message, res.statusCode));
  }
});

// delete city
router.delete('/:city_id', verifyToken, async (req, res) => {
  try {
    const deletedCity = await City.remove({_id: req.params.city_id});
    res.status(200).json(success('OK', {deletedCity}, res.statusCode));
  } catch ({message}) {
    res.status(500).json(error(message, res.statusCode));
  }
});

module.exports = router;
