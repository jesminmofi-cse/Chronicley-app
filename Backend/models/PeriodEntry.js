const mongoose = require('mongoose');
const periodEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  flow: {
    type: String,
    enum: ['light', 'medium', 'heavy'],
    default: 'medium',
    required: true
  },
  symptoms: {
    type: [String],
    default: []
  }
}, { timestamps: true });
module.exports = mongoose.model("PeriodEntry", periodEntrySchema);