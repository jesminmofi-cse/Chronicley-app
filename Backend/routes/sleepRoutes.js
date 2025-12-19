const express = require('express');
const router = express.Router();
const { addSleepEntry, getSleepEntries, deleteSleepEntry } = require('../controllers/sleepController');
const protect = require('../middleware/authMiddleware');
router.post('/', protect, addSleepEntry);
router.get('/', protect, getSleepEntries);
router.delete('/:id', protect, deleteSleepEntry);
module.exports = router;