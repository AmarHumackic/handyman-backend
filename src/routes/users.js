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
const city = require('../models/city');

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
    const users = await User.find().select('-password').lean();
    const cities = await City.find().lean();

    const usersResponse = users.map((user) => {
      const {
        _id,
        first_name,
        last_name,
        email,
        address,
        phone_number,
        city_id,
        fcm_tokens,
        services,
        created_at,
        updated_at,
      } = user;
      return {
        _id,
        first_name,
        last_name,
        email,
        address,
        phone_number,
        city_id,
        fcm_tokens,
        services,
        created_at,
        updated_at,
        city_name: cities.find((c) => c._id.toString() === city_id).name,
      };
    });
    res.status(200).json(success('OK', usersResponse, res.statusCode));
  } catch ({message}) {
    res.status(500).json(error(message, res.statusCode));
  }
});

// get logged user details
router.get('/details/:user_id', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.user_id).select('-password');
    const city = await City.findById(user.city_id);
    const {
      _id,
      first_name,
      last_name,
      email,
      address,
      phone_number,
      city_id,
      fcm_tokens,
      services,
      created_at,
      updated_at,
    } = user;
    res.status(200).json(
      success(
        'OK',
        {
          _id,
          first_name,
          last_name,
          email,
          address,
          phone_number,
          city_id,
          fcm_tokens,
          services,
          created_at,
          updated_at,
          city_name: city.name,
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
router.post('/register', async (req, res) => {
  // console.log('req.file', req.file);
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
    // profile_img: req.file.path || null,
  });
  try {
    const newUser = await user.save();

    res.status(200).json(
      success(
        'OK',
        {
          message: 'Registration success.',
          _id: newUser._id,
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
            _id: user._id,
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
          _id: payload.id,
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

// delete user
router.delete('/:user_id', verifyToken, async (req, res) => {
  try {
    const deletedUser = await User.remove({
      _id: req.params.user_id,
    });
    res.status(200).json(success('OK', deletedUser, res.statusCode));
  } catch ({message}) {
    res.status(500).json(error(message, res.statusCode));
  }
});

module.exports = router;
