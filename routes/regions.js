const express = require('express');
const router = express.Router();
const Region = require('../models/region');

// get all regions
router.get('/', async (req, res) => {
  try {
    const regions = await Region.find();
    res.json(regions);
  } catch ({message}) {
    res.status(500).json({error: message});
  }
});

// get region by id
router.get('/:region_id', async (req, res) => {
  try {
    const region = await Region.findById(req.params.region_id);
    res.json(region);
  } catch ({message}) {
    message.startsWith('Cast to')
      ? res.status(404).json({error: 'Region not found'})
      : res.status(500).json({error: message});
  }
});

// add region
router.post('/', async (req, res) => {
  const region = new Region({
    name: req.body.name,
    country_id: req.body.country_id,
  });
  try {
    const savedRegion = await region.save();
    res.json(savedRegion);
  } catch ({message}) {
    res.json({
      error: message,
    });
  }
});

module.exports = router;
