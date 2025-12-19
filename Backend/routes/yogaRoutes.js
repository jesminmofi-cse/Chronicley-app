const express = require('express');
const router = express.Router();
const { addYogaEntry, getYogaEntries, deleteYogaEntry } = require('../controllers/yogaController');
const protect = require('../middleware/authMiddleware');
router.post('/', protect, addYogaEntry);
router.get('/', protect, getYogaEntries);
router.delete('/:id', protect, deleteYogaEntry);
module.exports = router;