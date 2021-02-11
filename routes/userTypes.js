const express = require('express');
const router = express.Router();
const UserType = require('../models/userType');
const verifyToken = require('./verifyToken');
const {success, error} = require('../utils/responseApi');

// get all user types
router.get('/', async (req, res) => {
  try {
    const userTypes = await UserType.find();
    res.status(200).json(success('OK', {userTypes}, res.statusCode));
  } catch ({message}) {
    res.status(500).json(error(message, res.statusCode));
  }
});

// get user type by id
router.get('/:user_type_id', async (req, res) => {
  try {
    const userType = await UserType.findById(req.params.user_type_id);
    res.status(200).json(success('OK', {userType}, res.statusCode));
  } catch ({message}) {
    message.startsWith('Cast to')
      ? res.status(404).json(error('User type not found', res.statusCode))
      : res.status(500).json(error(message, res.statusCode));
  }
});

// add user type
router.post('/', verifyToken, async (req, res) => {
  const userType = new UserType({
    name: req.body.name,
  });
  try {
    const newUserType = await userType.save();
    res.status(200).json(success('OK', {newUserType}, res.statusCode));
  } catch ({message}) {
    res.status(500).json(error(message, res.statusCode));
  }
});

module.exports = router;
