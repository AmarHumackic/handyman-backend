const mongoose = require('mongoose');

const ServiceSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  service_category_id: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('service', ServiceSchema);
