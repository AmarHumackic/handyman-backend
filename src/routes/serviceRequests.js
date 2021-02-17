const express = require('express');
const router = express.Router();
const ServiceRequest = require('../models/serviceRequest');
const Service = require('../models/service');
const User = require('../models/user');
const verifyToken = require('./verifyToken');
const {success, error} = require('../utils/responseApi');
const getPagination = require('../utils/pagination');

// get all service requests
router.get('/', async (req, res) => {
  // use lean() for faster queries
  const {page, size} = req.query;
  const {limit, offset} = getPagination(page, size);

  try {
    // const serviceRequests = await ServiceRequest.find();
    const serviceRequests = await ServiceRequest.paginate({}, {offset, limit});
    res.status(200).json(success('OK', {serviceRequests}, res.statusCode));
  } catch ({message}) {
    res.status(500).json(error(message, res.statusCode));
  }
});

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
    const newServiceRequest = await serviceRequest.save();
    res.status(200).json(success('OK', {newServiceRequest}, res.statusCode));
  } catch ({message}) {
    res.status(500).json(error(message, res.statusCode));
  }
});

module.exports = router;
