const express = require('express');
const router = express.Router();
const User = require('../models/user');
const City = require('../models/city');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {SECRET} = process.env;
const verifyToken = require('./VerifyToken');

// get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch ({message}) {
    res.status(500).json({error: message});
  }
});

// get user by id
router.get('/getinfo', async (req, res) => {
  try {
    const user = await User.findById(req.body.user_id);
    const city = await City.findById(user.city_id);
    const {first_name, last_name, email, phone_number} = user;
    res.json({
      first_name,
      last_name,
      email,
      phone_number,
      city: city.name,
    });
  } catch ({message}) {
    message.startsWith('Cast to')
      ? res.status(404).json({error: 'User not found'})
      : res.status(500).json({error: message});
  }
});

// add user
router.post('/', async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    phone_number,
    fcm_tokens,
    city_id,
  } = req.body;
  const user = new User({
    first_name,
    last_name,
    email,
    password: bcrypt.hashSync(password, 8),
    phone_number,
    fcm_tokens,
    city_id,
  });
  try {
    const savedUser = await user.save();
    // Create a token
    const token = jwt.sign({id: user._id}, SECRET, {expiresIn: 86400});
    res.json({
      message: 'Registration success.',
      user_id: savedUser._id,
      email: savedUser.email,
      token,
    });
  } catch ({message}) {
    res.json({
      error: message,
    });
  }
});

// add user
router.put('/addtoken', async (req, res) => {
  const {user_id, fcm_token} = req.body;
  try {
    const user = await User.findById(user_id);
    user.fcm_tokens.push(fcm_token);
    await user.save();

    res.json({
      message: 'FCM token has been successfully saved.',
    });
  } catch ({message}) {
    res.json({
      error: message,
    });
  }
});

// add user
router.get('/login', async (req, res) => {
  const {email, password} = req.body;
  try {
    User.findOne({email}, (err, user) => {
      if (err) return res.status(500).send('Server error.');
      if (!user) return res.status(404).send('No user found.');

      var passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid) return res.status(401).send('Wrong credentials.');

      var token = jwt.sign({id: user._id}, SECRET, {
        expiresIn: 86400, // expires in 24 hours
      });

      res.status(200).send({
        message: 'Login success.',
        user_id: user._id,
        email: user.email,
        token,
      });
    });
  } catch ({message}) {
    res.json({
      error: message,
    });
  }
});

module.exports = router;
