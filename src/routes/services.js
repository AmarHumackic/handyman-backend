const express = require('express');
const router = express.Router();
const Service = require('../models/service');
const verifyToken = require('./verifyToken');
const {success, error} = require('../utils/responseApi');

// get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(success('OK', services, res.statusCode));
  } catch ({message}) {
    res.status(500).json(error(message, res.statusCode));
  }
});

// get service by id
router.get('/:service_id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.service_id);
    res.status(200).json(success('OK', service, res.statusCode));
  } catch ({message}) {
    message.startsWith('Cast to')
      ? res.status(404).json(error('Service not found', res.statusCode))
      : res.status(500).json(error(message, res.statusCode));
  }
});

// add service
router.post('/', verifyToken, async (req, res) => {
  const service = new Service({
    name: req.body.name,
    description: req.body.description,
    service_category_id: req.body.service_category_id,
  });
  try {
    const newService = await service.save();
    res.status(200).json(success('OK', newService, res.statusCode));
  } catch ({message}) {
    res.status(500).json(error(message, res.statusCode));
  }
});

module.exports = router;
