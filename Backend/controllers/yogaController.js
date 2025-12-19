const YogaEntry = require('../models/YogaEntry');
const addYogaEntry = async (req, res) => {
  const { type, duration, notes, date } = req.body;
  console.log("Incoming Yoga Entry:", req.body);
  console.log("Authenticated User ID:", req.userId);
  if (!req.userId || !type || !duration) {
    return res.status(400).json({ 
      message: 'Missing required fields: userId, type, or duration'
    });
  }
  try {
    const entry = await YogaEntry.create({
      userId: req.userId,
      type,
      duration,
      notes,
      date: date || new Date()
    });
    res.status(201).json(entry);
  } catch (err) {
    console.error(" Yoga Entry Error:", err.message);
    res.status(500).json({ message: 'Error adding yoga session', error: err.message });
  }
};
const getYogaEntries = async (req, res) => {
  try {
    const entries = await YogaEntry.find({ userId: req.userId }).sort({ date: -1 });
    res.status(200).json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving yoga logs', error: err.message });
  }
};
const deleteYogaEntry = async (req, res) => {
  try {
    const entry = await YogaEntry.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json({ message: 'Yoga session deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting yoga entry', error: err.message });
  }
};
module.exports = {
  addYogaEntry,
  getYogaEntries,
  deleteYogaEntry
};