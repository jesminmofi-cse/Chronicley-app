const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  createGratitudeEntry,
  getGratitudeEntries,
  deleteGratitudeEntry
} = require('../controllers/gratitudeController');
router.post('/', protect, createGratitudeEntry);
router.get('/', protect, getGratitudeEntries);
router.delete('/:id', protect, deleteGratitudeEntry);
module.exports = router;