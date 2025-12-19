const express = require('express');
const router = express.Router();
const { addMood, getMoods} =require('../controllers/moodController');
const protect = require('../middleware/authMiddleware');
router.post('/', protect, addMood); 
router.get('/', protect, getMoods);
module.exports = router;