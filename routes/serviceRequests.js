const express = require('express');
const router = express.Router();
const ServiceRequest = require('../models/serviceRequest');
const Service = require('../models/service');
const User = require('../models/user');
const verifyToken = require('./verifyToken');

// add service request
router.post('/', verifyToken, async (req, res) => {
  const {
    title,
    description,
    start_date,
    due_date,
    service_id,
    creator_id,
  } = req.body;
  try {
    const serviceExist = await Service.exists({_id: service_id});
    if (!serviceExist) throw new Error('Service does not exist.');

    const userExist = await User.exists({_id: creator_id});
    if (!userExist) throw new Error('User does not exist.');

    const serviceRequest = new ServiceRequest({
      title,
      description,
      start_date,
      due_date,
      service_id,
      creator_id,
    });
    const savedServiceRequest = await serviceRequest.save();
    res.json(savedServiceRequest);
  } catch ({message}) {
    res.json({
      error: message,
    });
  }
});

module.exports = router;