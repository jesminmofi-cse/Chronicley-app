const GratitudeEntry = require('../models/GratitudeEntry');
const createGratitudeEntry = async (req, res) => {
 const { date, grateful, intentions, goals, manifest, quote } = req.body;
 if (!date || !grateful || !intentions || !goals || !manifest) {
  return res.status(400).json({ message: 'All fields except quote are required' });
 }
 try {
  const entry = await GratitudeEntry.create({
    userId: req.userId,
    date,
    grateful, 
    intentions,
    goals,
    manifest,
    quote
  });
  res.status(201).json(entry);
} catch (error) {
  console.error('Error creating entry:', error.message);
  res.status(500).json({ message: 'Internal server error', error: error.message });
}
};
const getGratitudeEntries = async (req, res) => {
  try {
    const entries = await GratitudeEntry.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    console.error('Error fetching entries:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
const deleteGratitudeEntry = async (req, res) => {
  try {
    const deleted = await GratitudeEntry.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    if (!deleted) return res.status(404).json({ message: 'Entry not found' });
    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting entry:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
module.exports = {
  createGratitudeEntry,
  getGratitudeEntries,
  deleteGratitudeEntry
};