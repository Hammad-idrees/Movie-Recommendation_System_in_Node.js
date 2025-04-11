const express = require('express');
const { createDiscussion, getDiscussions, addComment } = require('../controllers/discussionController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

// Route to create a new discussion
router.post('/create', protect, createDiscussion);

// Route to get all discussions
router.get('/', getDiscussions);

// Route to add a comment to a discussion
router.post('/:id/comment', protect, addComment);

module.exports = router;
