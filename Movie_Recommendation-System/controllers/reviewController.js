const Movie = require('../models/movieModel');
const Review = require('../models/reviewModel');

// Add a new review
exports.addReview = async (req, res) => {
  const { movieId, rating, comment } = req.body;

  try {
    // Find the movie without using lean()
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Ensure movie.reviews is initialized
    if (!movie.reviews) {
      movie.reviews = [];
    }

    // Check if the user has already reviewed the movie
    const alreadyReviewed = movie.reviews.some(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Movie already reviewed' });
    }

    // Create the new review object
    const review = {
      user: req.user._id,
      rating: Number(rating),
      comment,
      createdAt: new Date(),
    };

    // Push the new review directly using a more efficient update query
    movie.reviews.push(review);

    // Recalculate the average rating
    const totalRating = movie.reviews.reduce((acc, item) => item.rating + acc, 0);
    movie.averageRating = totalRating / movie.reviews.length;

    // Save the movie with the new review and updated average rating
    await movie.save();

    res.status(201).json({ message: 'Review added', review });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Error adding review', error: error.message });
  }
};


// Update a review
exports.updateReview = async (req, res) => {
  const { movieId, rating, comment } = req.body;

  try {
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const review = movie.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    // Recalculate the average rating
    movie.averageRating =
      movie.reviews.reduce((acc, item) => item.rating + acc, 0) /
      movie.reviews.length;

    await movie.save();
    res.status(200).json({ message: 'Review updated', review });
  } catch (error) {
    res.status(500).json({ message: 'Error updating review', error: error.message });
  }
};

// Get movie reviews
exports.getReviews = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId).populate('reviews.user', 'name');

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json(movie.reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};
//Delete
// Delete a review
exports.deleteReview = async (req, res) => {
  const { movieId, reviewId } = req.params;

  try {
    // Find the movie by ID
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Find the index of the review
    const reviewIndex = movie.reviews.findIndex(
      (review) => review._id.toString() === reviewId
    );

    if (reviewIndex === -1) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if the user requesting the deletion is the owner of the review
    if (movie.reviews[reviewIndex].user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this review' });
    }

    // Remove the review from the reviews array
    movie.reviews.splice(reviewIndex, 1);

    // Recalculate the average rating
    if (movie.reviews.length > 0) {
      const totalRating = movie.reviews.reduce((acc, item) => item.rating + acc, 0);
      movie.averageRating = totalRating / movie.reviews.length;
    } else {
      movie.averageRating = 0; // Reset if no reviews remain
    }

    // Save the updated movie
    await movie.save();

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
};