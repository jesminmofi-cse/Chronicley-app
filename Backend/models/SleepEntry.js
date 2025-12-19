const mongoose = require('mongoose');
const sleepEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  sleepStart: {
    type: Date,
    required: true
  },
  sleepEnd: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // duration in hours
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });
module.exports = mongoose.model('SleepEntry', sleepEntrySchema);