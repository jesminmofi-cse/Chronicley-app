const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  startedDate: Date,
  finishedDate: Date,
  rating: Number,
  status: { type: String, enum: ['to read', 'reading', 'completed'] },
  review: String,
  summary: String,
  tags: [String],
  imageUrl: String
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
