const express = require('express');
const router = express.Router();
const { logBreathingSession, getUserBreathingSessions } = require('../controllers/breathingController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, logBreathingSession);         // Log a completed session
router.get('/', authMiddleware, getUserBreathingSessions);     // View user sessions

module.exports = router;
