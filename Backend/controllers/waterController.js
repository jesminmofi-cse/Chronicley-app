const WaterEntry = require('../models/WaterEntry');
const addWaterEntry = async (req, res) => {
  const { amount, date } = req.body; 
  try {
    const entry = await WaterEntry.create({
      userId: req.userId,
      amount,
      date: date ? new Date(date) : new Date() 
    });
    res.status(201).json(entry);
  } catch (err) {
    console.error('Water entry error:', err);
    res.status(500).json({ msg: 'Failed to log water intake', error: err.message });
  }
};

const getWaterEntries = async (req, res) => {
  try {
    const entries = await WaterEntry.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(entries);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch water data', error: err.message });
  }
};
const updateWaterEntry = async (req, res) => {
  const { amount } = req.body;
  try {
    const entry = await WaterEntry.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { amount },
      { new: true }
    );
    if (!entry) return res.status(404).json({ msg: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update entry', error: err.message });
  }
};
const deleteWaterEntry = async (req, res) => {
  try {
    const entry = await WaterEntry.findOneAndDelete({ _id: req.params.id, userId: req.userId });

    if (!entry) return res.status(404).json({ msg: 'Entry not found' });

    res.json({ msg: 'Entry deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete entry', error: err.message });
  }
};
module.exports = {
  addWaterEntry,
  getWaterEntries,
  updateWaterEntry,
  deleteWaterEntry
};