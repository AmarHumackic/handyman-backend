const express = require('express');
const router = express.Router();
const Region = require('../models/region');
const verifyToken = require('./verifyToken');
const {success, error} = require('../utils/responseApi');

// get all regions
router.get('/', async (req, res) => {
  try {
    const regions = await Region.find(); // use lean() for faster queries
    res.status(200).json(success('OK', regions, res.statusCode));
  } catch ({message}) {
    res.status(500).json(error(message, res.statusCode));
  }
});

// get region by id
router.get('/:region_id', async (req, res) => {
  try {
    const region = await Region.findById(req.params.region_id);
    res.status(200).json(success('OK', region, res.statusCode));
  } catch ({message}) {
    message.startsWith('Cast to')
      ? res.status(404).json(error('Region not found', res.statusCode))
      : res.status(500).json(error(message, res.statusCode));
  }
});

// add region
router.post('/', verifyToken, async (req, res) => {
  const region = new Region({
    name: req.body.name,
    country_id: req.body.country_id,
  });
  try {
    const newRegion = await region.save();
    res.status(200).json(success('OK', newRegion, res.statusCode));
  } catch ({message}) {
    res.status(500).json(error(message, res.statusCode));
  }
});

// delete region
router.delete('/:region_id', verifyToken, async (req, res) => {
  try {
    const deletedRegion = await Region.remove({
      _id: req.params.region_id,
    });
    res.status(200).json(success('OK', deletedRegion, res.statusCode));
  } catch ({message}) {
    res.status(500).json(error(message, res.statusCode));
  }
});

module.exports = router;
