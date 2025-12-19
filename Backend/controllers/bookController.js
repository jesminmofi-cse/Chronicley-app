const Book = require('../models/Book');

exports.addBook = async (req, res) => {
  try {
    const newBook = new Book({ ...req.body, userId: req.userId });
    const saved = await newBook.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add book', error: err.message });
  }
};

exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch books' });
  }
};
