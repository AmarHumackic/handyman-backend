const mongoose = require('mongoose');

const ServiceCategoriesSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('service_categories', ServiceCategoriesSchema);
