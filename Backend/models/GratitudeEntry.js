const mongoose = require('mongoose');
const gratitudeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  grateful: {
    type: [String],
    default: []
  },
  intentions: {
    type: [String],
    default: []
  },
  goals: {
    type: [String],
    default: []
  },
  manifest: {
    type: [String],
    default: []
  },
  quote: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('GratitudeEntry', gratitudeSchema);
