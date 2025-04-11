const express = require('express');
const {
  addMovie,
  updateMovie,
  deleteMovie,
  searchMovies,
  filterMovies,
  advancedFilterMovies,
  removeReview,
  getInsights,
  getMovieById,
} = require('../controllers/movieController');
const { protect } = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Set up multer for image upload
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Route to add a new movie (protected)
router.post('/add', protect, addMovie);

// Route to update an existing movie (protected)
router.put('/update/:id', protect, updateMovie);

// Specific routes must be defined before routes with dynamic parameters like `/:id`
// Route to search for movies
router.get('/search', searchMovies);

// Route to filter movies by ratings, popularity, and release year
router.get('/filter', filterMovies);

// Route for advanced filtering of movies (e.g., by decade, country, language, or keywords)
router.get('/filter/advanced', advancedFilterMovies);

// Route to upload a movie cover photo
router.post('/upload', protect, upload.single('coverPhoto'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.status(200).json({
    message: 'File uploaded successfully',
    filePath: `/uploads/${req.file.filename}`,
  });
});

// Route to get insights on most popular movies and user activity
router.get('/insights', protect, getInsights);

// Route to get a movie by ID (should be defined after more specific routes)
router.get('/:id', getMovieById);

// Route to delete a movie (protected)
router.delete('/delete/:id', protect, deleteMovie);

// Route to remove inappropriate reviews (protected)
router.delete('/:movieId/reviews/:reviewId', protect, removeReview);

module.exports = router;
