const express = require('express');
const {
  createList,
  shareList,
  followList,
  getListById,
  getFollowedLists,
  deleteList, // Import the deleteList function
} = require('../controllers/listController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Define routes
router.get('/followed', protect, getFollowedLists);
router.post('/create', protect, createList);
router.post('/share', protect, shareList);
router.post('/follow', protect, followList);
router.delete('/:id', protect, deleteList); // Add the route for deleting a list
router.get('/:id', protect, getListById);

module.exports = router;
