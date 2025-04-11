const express = require('express');
const { getUpcomingMovies, setReminder } = require('../controllers/upcomingController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

// Route to get upcoming movies
router.get('/upcoming', getUpcomingMovies);

// Route to set a reminder (protected route)
router.post('/set-reminder', protect, setReminder);

module.exports = router;
