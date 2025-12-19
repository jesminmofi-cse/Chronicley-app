const express = require('express');
const router = express.Router();
const { addBook, getBooks } = require('../controllers/bookController');
const protect = require('../middleware/authMiddleware');

router.route('/').post(protect, addBook).get(protect, getBooks);

module.exports = router;
