const MoodEntry = require('../models/MoodEntry');
const addMood = async (req, res) => {
  console.log("Mood Request Body:", req.body);
  console.log("User ID:", req.userId);
  const { mood, date } = req.body;
  if (!req.userId) {
    return res.status(401).json({ message: 'Unauthorized: User info missing' });
  }
  if (!mood || !date) {
    return res.status(400).json({ message: 'Mood and date are required' });
  }
  try {
    const newMood = await MoodEntry.create({
      userId: req.userId,
      mood,
      date,
    });
    res.status(201).json(newMood);
  } catch (error) {
    console.error(" Error in addMood:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
const getMoods = async (req, res) => {
  console.log(" Getting moods for user:", req.userId);
  if (!req.userId) {
    return res.status(401).json({ message: 'Unauthorized: User info missing' });
  }
  try {
    const moods = await MoodEntry.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(moods);
  } catch (error) {
    console.error("Error in getMoods:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
module.exports = { addMood, getMoods };