const express = require('express');
const router = express.Router();
const User = require('../models/user');
const City = require('../models/city');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {SECRET, REFRESH_SECRET} = process.env;
const verifyToken = require('./verifyToken');

// get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch ({message}) {
    res.status(500).json({error: message});
  }
});

// get logged user details
router.get('/details', verifyToken, async (req, res) => {
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

// register user
router.post('/register', async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    address,
    phone_number,
    fcm_tokens,
    city_id,
  } = req.body;
  const user = new User({
    first_name,
    last_name,
    email,
    password: bcrypt.hashSync(password, 8),
    address,
    phone_number,
    fcm_tokens,
    city_id,
  });
  try {
    const savedUser = await user.save();

    res.json({
      message: 'Registration success.',
      user_id: savedUser._id,
      email: savedUser.email,
    });
  } catch ({message}) {
    res.json({
      error: message,
    });
  }
});

// add FCM token
router.put('/add-fcm-token', verifyToken, async (req, res) => {
  const {user_id, fcm_token} = req.body;
  try {
    const user = await User.findById(user_id);
    user.fcm_tokens.push(fcm_token);
    user.updated_at = new Date();
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

// login user
router.post('/login', async (req, res) => {
  const {email, password} = req.body;
  try {
    User.findOne({email}, (err, user) => {
      if (err) return res.status(500).send('Server error.');
      if (!user) return res.status(404).send('No user found.');

      const passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid) return res.status(401).send('Wrong credentials.');

      const payload = {id: user._id};
      const token = jwt.sign(payload, SECRET, {
        expiresIn: '7d',
      });

      const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
        expiresIn: '30d',
      });

      res.status(200).send({
        message: 'Login success.',
        user_id: user._id,
        email: user.email,
        token,
        refresh_token: refreshToken,
      });
    });
  } catch ({message}) {
    res.json({
      error: message,
    });
  }
});

// refresh user's token
router.post('/refresh-token', async (req, res) => {
  const {refresh_token} = req.body;
  try {
    const decoded = jwt.verify(refresh_token, REFRESH_SECRET);
    const payload = {id: decoded.id};

    const newToken = jwt.sign(payload, SECRET, {
      expiresIn: 60,
    });

    const newRefreshToken = jwt.sign(payload, REFRESH_SECRET, {
      expiresIn: 120,
    });

    res.status(200).send({
      message: 'Refresh token success.',
      user_id: payload.id,
      token: newToken,
      refresh_token: newRefreshToken,
    });
  } catch ({message}) {
    res.status(500).json({error: 'Failed to refresh the token.'});
  }
});

// update services
router.put('/update-services', verifyToken, async (req, res) => {
  const {user_id, services} = req.body;
  try {
    const user = await User.findById(user_id);
    if (services instanceof Array) {
      user.services = [...new Set(services)];
      user.updated_at = new Date();
      await user.save();

      res.json({
        message: 'Services have been successfully updated.',
      });
    } else {
      throw new Error('Invalid data type, an array of services is required.');
    }
  } catch ({message}) {
    res.json({
      error: message,
    });
  }
});

module.exports = router;
