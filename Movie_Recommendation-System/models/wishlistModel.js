const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  movies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
  ],
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Wishlist', wishlistSchema);
