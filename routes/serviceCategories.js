const express = require('express');
const router = express.Router();
const ServiceCategories = require('../models/serviceCategories');

// get all service categories
router.get('/', async (req, res) => {
  try {
    const serviceCategories = await ServiceCategories.find();
    res.json(serviceCategories);
  } catch ({message}) {
    res.status(500).json({error: message});
  }
});

// get service category by id
router.get('/:service_category_id', async (req, res) => {
  try {
    const serviceCategory = await ServiceCategories.findById(
      req.params.service_category_id,
    );
    res.json(serviceCategory);
  } catch ({message}) {
    message.startsWith('Cast to')
      ? res.status(404).json({error: 'Service category not found'})
      : res.status(500).json({error: message});
  }
});

// add service category
router.post('/', async (req, res) => {
  const serviceCategory = new ServiceCategories({
    name: req.body.name,
    description: req.body.description,
  });
  try {
    const savedServiceCategory = await serviceCategory.save();
    res.json(savedServiceCategory);
  } catch ({message}) {
    res.json({
      error: message,
    });
  }
});

module.exports = router;
