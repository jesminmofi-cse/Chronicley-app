// routes/WishRoutes.js
const express = require('express');
const router = express.Router();
const {
  createWish,
  getWishes,
  toggleWishFulfilled,
  deleteWish
} = require('../controllers/wishController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, createWish);
router.get('/', protect, getWishes);
router.put('/:id/toggle', protect, toggleWishFulfilled);
router.delete('/:id', protect, deleteWish);

module.exports = router;
