const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ServiceRequestsSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  start_date: {
    type: Date,
    required: true,
  },
  due_date: {
    type: Date,
    required: false,
  },
  service_id: {
    type: String,
    required: true,
  },
  creator_id: {
    type: String,
    required: true,
  },
  servicer_id: {
    type: String,
    required: false,
    default: null,
  },
  completed: {
    type: Boolean,
    required: true,
    default: false,
  },
  feedback_left: {
    type: Boolean,
    required: true,
    default: false,
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    required: false,
    default: null,
  },
});

ServiceRequestsSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('service_request', ServiceRequestsSchema);
