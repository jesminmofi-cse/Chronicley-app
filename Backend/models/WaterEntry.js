const mongoose = require('mongoose');
const waterEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  amount: {
    type: Number, 
    required: true,
    min: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });
module.exports = mongoose.model('WaterEntry', waterEntrySchema);
