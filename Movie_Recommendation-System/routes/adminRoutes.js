const express = require('express');
const {
  registerAdmin,
  loginAdmin,
  getAdminDetails,
  updateAdminDetails,
  deleteAdmin,
} = require('../controllers/adminController');
const {
  addMovie,
  updateMovie,
  deleteMovie,
  removeReview,
  getInsights,
  getMovieById,
} = require('../controllers/movieController'); // Import movieController functions
const { protectAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Admin registration
router.post('/register', registerAdmin);

// Admin login
router.post('/login', loginAdmin);

// Get admin details (protected)
router.get('/profile', protectAdmin, getAdminDetails);

// Update admin details (protected)
router.put('/profile', protectAdmin, updateAdminDetails);

// Delete admin account (protected)
router.delete('/profile', protectAdmin, deleteAdmin);

// Admin-specific movie operations
router.post('/movie/add', protectAdmin, addMovie); // Add a new movie
router.put('/movie/update/:id', protectAdmin, updateMovie); // Update a movie
router.delete('/movie/delete/:id', protectAdmin, deleteMovie); // Delete a movie
router.delete('/movie/:movieId/review/:reviewId', protectAdmin, removeReview); // Remove a review
router.get('/movies/insights', protectAdmin, getInsights); // Get insights about movies
router.get('/movie/:id', protectAdmin, getMovieById); // Get a movie by ID

module.exports = router;
