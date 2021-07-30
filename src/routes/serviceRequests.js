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
    const serviceRequests = await ServiceRequest.paginate(
      {servicer_id: null},
      {offset, limit},
    );
    res.status(200).json(success('OK', serviceRequests, res.statusCode));
  } catch ({message}) {
    res.status(500).json(error(message, res.statusCode));
  }
});

// get all service requests of a logged user
router.get('/:user_id', async (req, res) => {
  // use lean() for faster queries
  const {page, size} = req.query;
  const {limit, offset} = getPagination(page, size);

  try {
    // const serviceRequests = await ServiceRequest.find();
    const serviceRequests = await ServiceRequest.paginate(
      {creator_id: req.params.user_id},
      {offset, limit},
    );
    res.status(200).json(success('OK', serviceRequests, res.statusCode));
  } catch ({message}) {
    res.status(500).json(error(message, res.statusCode));
  }
});

// add service request
router.post('/', verifyToken, async (req, res) => {
  const {title, description, start_date, due_date, service_id, creator_id} =
    req.body;
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
    res.status(200).json(success('OK', newServiceRequest, res.statusCode));
  } catch ({message}) {
    res.status(500).json(error(message, res.statusCode));
  }
});

// accept service request (job)
router.post('/accept', verifyToken, async (req, res) => {
  const {service_request_id, user_id} = req.body;
  try {
    if (!service_request_id || !user_id)
      throw new Error('service_request_id and user_id can not be empty.');

    const serviceRequest = await ServiceRequest.findById({
      _id: service_request_id,
    });
    if (!serviceRequest) throw new Error('Service request does not exist.');

    const userExist = await User.exists({_id: user_id});
    if (!userExist) throw new Error('User does not exist.');

    // edit service request to add servicer_id
    serviceRequest.servicer_id = user_id;
    serviceRequest.updated_at = new Date();
    await serviceRequest.save();
    res.status(200).json(success('OK', serviceRequest, res.statusCode));
  } catch ({message}) {
    res.status(500).json(error(message, res.statusCode));
  }
});

// get all service requests accepted by logged user (get my jobs)
router.get('/:user_id/jobs', async (req, res) => {
  // use lean() for faster queries
  const {page, size} = req.query;
  const {limit, offset} = getPagination(page, size);

  try {
    // const serviceRequests = await ServiceRequest.find();
    const serviceRequests = await ServiceRequest.paginate(
      {servicer_id: req.params.user_id},
      {offset, limit},
    );
    res.status(200).json(success('OK', serviceRequests, res.statusCode));
  } catch ({message}) {
    res.status(500).json(error(message, res.statusCode));
  }
});

module.exports = router;
