const express = require('express');
const router = express.Router();
const User = require('../models/user');
const City = require('../models/city');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {SECRET, REFRESH_SECRET} = process.env;
const verifyToken = require('./verifyToken');
const {success, error} = require('../utils/responseApi');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname); // can be any of the names, e.g new Date().toISOString() + file.originalname;
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    // throw an error if needed
    cb(null, false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024,
  },
  fileFilter,
});

// get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(success('OK', {users}, res.statusCode));
  } catch ({message}) {
    res.status(500).json(error(message, res.statusCode));
  }
});

// get logged user details
router.get('/details', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.body.user_id);
    const city = await City.findById(user.city_id);
    const {first_name, last_name, email, phone_number} = user;
    res.status(200).json(
      success(
        'OK',
        {
          first_name,
          last_name,
          email,
          phone_number,
          city: city.name,
        },
        res.statusCode,
      ),
    );
  } catch ({message}) {
    message.startsWith('Cast to')
      ? res.status(404).json(error('User not found', res.statusCode))
      : res.status(500).json(error(message, res.statusCode));
  }
});

// register user
router.post('/register', upload.single('profile_img'), async (req, res) => {
  console.log('req.file', req.file);
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
    profile_img: req.file.path,
  });
  try {
    const newUser = await user.save();

    res.status(200).json(
      success(
        'OK',
        {
          message: 'Registration success.',
          user_id: newUser._id,
          email: newUser.email,
        },
        res.statusCode,
      ),
    );
  } catch ({message}) {
    res.status(500).json(error(message, res.statusCode));
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

    res
      .status(200)
      .json(
        success(
          'OK',
          {message: 'FCM token has been successfully saved.'},
          res.statusCode,
        ),
      );
  } catch ({message}) {
    res.status(500).json(error(message, res.statusCode));
  }
});

// login user
router.post('/login', async (req, res) => {
  const {email, password} = req.body;
  try {
    User.findOne({email}, (err, user) => {
      if (err)
        return res.status(500).json(error('Server error.', res.statusCode));
      if (!user)
        return res.status(404).json(error('No user found.', res.statusCode));

      const passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid)
        return res
          .status(401)
          .json(error('Wrong credentials.', res.statusCode));

      const payload = {id: user._id};
      const token = jwt.sign(payload, SECRET, {
        expiresIn: '7d',
      });

      const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
        expiresIn: '30d',
      });

      res.status(200).json(
        success(
          'OK',
          {
            message: 'Login success.',
            user_id: user._id,
            email: user.email,
            access_token: token,
            refresh_token: refreshToken,
          },
          res.statusCode,
        ),
      );
    });
  } catch ({message}) {
    res.status(500).json(error(message, res.statusCode));
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

    res.status(200).json(
      success(
        'OK',
        {
          message: 'Refresh token success.',
          user_id: payload.id,
          access_token: newToken,
          refresh_token: newRefreshToken,
        },
        res.statusCode,
      ),
    );
  } catch ({message}) {
    res.status(500).json(error('Failed to refresh the token.', res.statusCode));
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

      res.status(200).json(
        success(
          'OK',
          {
            message: 'Services have been successfully updated.',
          },
          res.statusCode,
        ),
      );
    } else {
      res
        .status(400)
        .json(
          error(
            'Invalid data type, an array of services is required.',
            res.statusCode,
          ),
        );
    }
  } catch ({message}) {
    res.status(500).json(error(message, res.statusCode));
  }
});

module.exports = router;
