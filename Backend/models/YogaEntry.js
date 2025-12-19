const mongoose = require('mongoose');
const yogaEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  type: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  notes: String,
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });
module.exports = mongoose.model('YogaEntry', yogaEntrySchema);