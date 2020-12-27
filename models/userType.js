const mongoose = require('mongoose');

const UserTypeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user_type', UserTypeSchema);
