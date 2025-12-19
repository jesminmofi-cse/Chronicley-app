const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,  // ✅ CORRECT
    ref: 'User',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Photo', photoSchema);
