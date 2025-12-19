const JournalEntry = require('../models/JournalEntry');
const createEntry = async (req, res) => {
  try {
    const { content, date } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Journal content is required." });
    }
    const newEntry = await JournalEntry.create({
      userId: req.userId, 
      content,
      date
    });
    res.status(201).json(newEntry);
  } catch (error) {
    console.error("Error creating journal entry:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
const getEntries = async (req, res) => {
  try {
    const entries = await JournalEntry.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    console.error("Error fetching journal entries:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
const deleteEntry = async (req, res) => {
  try {
    const entry = await JournalEntry.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.json({ message: "Entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting journal entry:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
module.exports = { createEntry, getEntries, deleteEntry };