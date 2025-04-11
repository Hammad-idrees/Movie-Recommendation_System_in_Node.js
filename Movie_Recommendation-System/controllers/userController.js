const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Register User
exports.registerUser = async (req, res) => {
  const { name, email, password, preferences } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, preferences });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }
      user.preferences = req.body.preferences || user.preferences;

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add to Wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { movieId } = req.body;

    if (!user.wishlist.includes(movieId)) {
      user.wishlist.push(movieId);
      await user.save();
      res.status(200).json({ message: 'Movie added to wishlist', wishlist: user.wishlist });
    } else {
      res.status(400).json({ message: 'Movie already in wishlist' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove from Wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { movieId } = req.body;

    if (user.wishlist.includes(movieId)) {
      user.wishlist = user.wishlist.filter((id) => id.toString() !== movieId);
      await user.save();
      res.status(200).json({ message: 'Movie removed from wishlist', wishlist: user.wishlist });
    } else {
      res.status(400).json({ message: 'Movie not found in wishlist' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
