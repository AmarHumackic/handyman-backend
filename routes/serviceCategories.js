const express = require('express');
const router = express.Router();
const ServiceCategory = require('../models/serviceCategory');
const verifyToken = require('./verifyToken');
const {success, error} = require('../utils/responseApi');

// get all service categories
router.get('/', async (req, res) => {
  try {
    const serviceCategories = await ServiceCategory.find();
    res.status(200).json(success('OK', {serviceCategories}, res.statusCode));
  } catch ({message}) {
    res.status(500).json(error(message, res.statusCode));
  }
});

// get service category by id
router.get('/:service_category_id', async (req, res) => {
  try {
    const serviceCategory = await ServiceCategory.findById(
      req.params.service_category_id,
    );
    res.status(200).json(success('OK', {serviceCategory}, res.statusCode));
  } catch ({message}) {
    message.startsWith('Cast to')
      ? res
          .status(404)
          .json(error('Service category not found', res.statusCode))
      : res.status(500).json(error(message, res.statusCode));
  }
});

// add service category
router.post('/', verifyToken, async (req, res) => {
  const serviceCategory = new ServiceCategory({
    name: req.body.name,
    description: req.body.description,
  });
  try {
    const newServiceCategory = await serviceCategory.save();
    res.status(200).json(success('OK', {newServiceCategory}, res.statusCode));
  } catch ({message}) {
    res.status(500).json(error(message, res.statusCode));
  }
});

module.exports = router;
