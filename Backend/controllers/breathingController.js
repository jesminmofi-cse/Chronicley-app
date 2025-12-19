const BreathingSession = require('../models/BreathingSession');

// Add a completed session
const logBreathingSession = async (req, res) => {
  try {
    const { roundsCompleted } = req.body;

    if (!roundsCompleted || roundsCompleted <= 0) {
      return res.status(400).json({ message: 'Invalid round count' });
    }

    const session = await BreathingSession.create({
      userId: req.userId,
      roundsCompleted,
    });

    res.status(201).json(session);
  } catch (err) {
    console.error('Error logging session:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Fetch all sessions for a user
const getUserBreathingSessions = async (req, res) => {
  try {
    const sessions = await BreathingSession.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    console.error('Error fetching sessions:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  logBreathingSession,
  getUserBreathingSessions,
};
