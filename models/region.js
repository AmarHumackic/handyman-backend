const mongoose = require('mongoose');

const RegionSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  country_id: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('region', RegionSchema);
