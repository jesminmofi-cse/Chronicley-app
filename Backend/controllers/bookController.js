const Book = require('../models/Book');

// ➕ ADD BOOK
exports.addBook = async (req, res) => {
  try {
    const newBook = await Book.create({
      ...req.body,
      userId: req.user.id, // ✅ FIX
    });

    res.status(201).json(newBook);
  } catch (err) {
    console.error('Add book error:', err);
    res.status(500).json({
      message: 'Failed to add book',
      error: err.message,
    });
  }
};

// 📚 GET USER BOOKS
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find({ userId: req.user.id }) // ✅ FIX
      .sort({ createdAt: -1 });

    res.status(200).json(books);
  } catch (err) {
    console.error('Get books error:', err);
    res.status(500).json({
      message: 'Failed to fetch books',
      error: err.message,
    });
  }
};
