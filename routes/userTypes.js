const express = require('express');
const router = express.Router();
const UserType = require('../models/userType');
const verifyToken = require('./verifyToken');

// get all user types
router.get('/', verifyToken, async (req, res) => {
  try {
    const userTypes = await UserType.find();
    res.json(userTypes);
  } catch ({message}) {
    res.status(500).json({error: message});
  }
});

// get user type by id
router.get('/:user_type_id', verifyToken, async (req, res) => {
  try {
    const userType = await UserType.findById(req.params.user_type_id);
    res.json(userType);
  } catch ({message}) {
    message.startsWith('Cast to')
      ? res.status(404).json({error: 'User type not found'})
      : res.status(500).json({error: message});
  }
});

// add user type
router.post('/', verifyToken, async (req, res) => {
  const userType = new UserType({
    name: req.body.name,
  });
  try {
    const savedUserType = await userType.save();
    res.json(savedUserType);
  } catch ({message}) {
    res.json({
      error: message,
    });
  }
});

module.exports = router;
