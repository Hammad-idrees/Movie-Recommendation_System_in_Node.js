const express = require('express');
const {
  addReview,
  updateReview,
  getReviews,
  deleteReview, // Import the new deleteReview function
} = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

// Route to add a review (protected)
router.post('/add', protect, addReview);

// Route to update a review (protected)
router.put('/update', protect, updateReview);

// Route to get reviews for a specific movie
router.get('/:movieId', getReviews);

// Route to delete a review (protected)
router.delete('/:movieId/reviews/:reviewId', protect, deleteReview);

module.exports = router;
