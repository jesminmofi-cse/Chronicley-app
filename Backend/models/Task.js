// models/Task.js
const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  dueDate: {
    type: Date,
    default: null
  }
}, { timestamps: true });
module.exports = mongoose.model('Task', taskSchema);