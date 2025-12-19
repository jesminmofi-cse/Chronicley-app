const Task = require('../models/Task');
const createTask = async (req, res) => {
  const { title, dueDate } = req.body;
  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }
  try {
    const newTask = await Task.create({
      userId: req.userId, 
      title,
      dueDate
    });
    res.status(201).json(newTask);
  } catch (error) {
    console.error(" Error creating task:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error(" Error fetching tasks:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
const toggleTaskCompletion = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    task.isCompleted = !task.isCompleted;
    await task.save();
    res.json(task);
  } catch (error) {
    console.error("Error toggling task:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(" Error deleting task:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
module.exports = {
  createTask,
  getTasks,
  toggleTaskCompletion,
  deleteTask
};