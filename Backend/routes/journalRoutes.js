const express = require('express');
const router = express.Router();
const { createEntry, getEntries, deleteEntry } = require('../controllers/journalController');
const protect = require('../middleware/authMiddleware');
router.post('/', protect, createEntry);     
router.get('/', protect, getEntries);        
router.delete('/:id', protect, deleteEntry); 
module.exports = router;