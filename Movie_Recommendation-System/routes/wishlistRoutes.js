const express = require('express');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} = require('../controllers/wishlistController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Route to get the user's wishlist
router.get('/', protect, getWishlist);

// Route to add a movie to the wishlist
router.post('/add', protect, addToWishlist);

// Route to remove a movie from the wishlist
router.delete('/remove', protect, removeFromWishlist);

module.exports = router;
