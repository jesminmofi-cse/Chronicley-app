const SleepEntry = require('../models/SleepEntry');
const addSleepEntry = async (req, res) => {
  const { sleepStart, sleepEnd } = req.body;
  try {
    const start = new Date(sleepStart);
    const end = new Date(sleepEnd);
    const duration = (end - start) / (1000 * 60 * 60); 
    if (duration <= 0) {
      return res.status(400).json({ message: "Sleep end must be after sleep start." });
    }
    const entry = await SleepEntry.create({
      userId: req.userId,
      sleepStart: start,
      sleepEnd: end,
      duration,
    });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: "Error recording sleep entry", error: err.message });
  }
};
const getSleepEntries = async (req, res) => {
  try {
    const entries = await SleepEntry.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(entries);
  } catch (err) {
    res.status(500).json({ message: "Error fetching sleep data", error: err.message });
  }
};
const deleteSleepEntry = async (req, res) => {
  try {
    const entry = await SleepEntry.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!entry) return res.status(404).json({ message: "Entry not found" });
    res.json({ message: "Entry deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting sleep entry", error: err.message });
  }
};
module.exports = {
  addSleepEntry,
  getSleepEntries,
  deleteSleepEntry
};
