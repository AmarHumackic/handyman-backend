const express = require('express');
const router = express.Router();
const Service = require('../models/service');

// get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch ({message}) {
    res.status(500).json({error: message});
  }
});

// get service by id
router.get('/:service_id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.service_id);
    res.json(service);
  } catch ({message}) {
    message.startsWith('Cast to')
      ? res.status(404).json({error: 'Service not found'})
      : res.status(500).json({error: message});
  }
});

// add service
router.post('/', async (req, res) => {
  const service = new Service({
    name: req.body.name,
    description: req.body.description,
    service_category_id: req.body.service_category_id,
  });
  try {
    const savedService = await service.save();
    res.json(savedService);
  } catch ({message}) {
    res.json({
      error: message,
    });
  }
});

module.exports = router;
