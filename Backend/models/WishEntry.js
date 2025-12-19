// models/Wishlist.js
const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
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
  isFulfilled: {
    type: Boolean,
    default: false
  },
  targetDate: {
    type: Date,
    default: null
  },
  imageUrl: {
  type: String,
  default: ''
  }

}, { timestamps: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
