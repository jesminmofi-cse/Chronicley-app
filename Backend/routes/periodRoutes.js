const express = require('express');
const router= express.Router();
const protect = require('../middleware/authMiddleware');
const{
    createPeriodEntry,
    getPeriodEntries,
    deletePeriodEntry
}=require('../controllers/periodController');
router.post('/', protect, createPeriodEntry);
router.get('/', protect, getPeriodEntries);
router.delete('/:id', protect, deletePeriodEntry);
module.exports = router;