const User = require('../models/userModel');

// Controller function to get the user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist', error: error.message });
  }
};

// Controller function to add a movie to the wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { movieId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.wishlist.includes(movieId)) {
      user.wishlist.push(movieId);
      await user.save();
      res.status(200).json({ message: 'Movie added to wishlist', wishlist: user.wishlist });
    } else {
      res.status(400).json({ message: 'Movie already in wishlist' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error adding to wishlist', error: error.message });
  }
};

// Controller function to remove a movie from the wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { movieId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.wishlist.includes(movieId)) {
      user.wishlist = user.wishlist.filter((id) => id.toString() !== movieId);
      await user.save();
      res.status(200).json({ message: 'Movie removed from wishlist', wishlist: user.wishlist });
    } else {
      res.status(400).json({ message: 'Movie not found in wishlist' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error removing from wishlist', error: error.message });
  }
};
