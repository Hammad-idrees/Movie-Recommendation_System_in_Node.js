const Movie = require('../models/movieModel');
const User = require('../models/userModel');

// Get personalized recommendations based on user preferences and ratings
exports.getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get favorite genres and recently rated movies by the user
    const favoriteGenres = user.preferences?.favoriteGenres || [];
    const ratedMovies = user.wishlist.map((movie) => movie._id);

    // Find movies that match the user's favorite genres and exclude already rated movies
    const recommendedMovies = await Movie.find({
      genre: { $in: favoriteGenres },
      _id: { $nin: ratedMovies },
    }).sort({ averageRating: -1 }).limit(10);

    res.status(200).json(recommendedMovies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recommendations', error: error.message });
  }
};

// Get similar titles based on genre, director, or popularity
exports.getSimilarTitles = async (req, res) => {
  const { movieId } = req.params;

  try {
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Find similar movies based on genre, director, or popularity
    const similarMovies = await Movie.find({
      $or: [
        { genre: { $in: movie.genre } },
        { director: movie.director },
      ],
      _id: { $ne: movie._id },
    }).sort({ averageRating: -1 }).limit(5);

    res.status(200).json(similarMovies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching similar titles', error: error.message });
  }
};

// Get trending movies based on user activity and ratings
exports.getTrendingMovies = async (req, res) => {
  try {
    const trendingMovies = await Movie.find().sort({ reviewCount: -1, averageRating: -1 }).limit(10);
    res.status(200).json(trendingMovies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trending movies', error: error.message });
  }
};

// Get top-rated movies
exports.getTopRatedMovies = async (req, res) => {
  try {
    const topRatedMovies = await Movie.find().sort({ averageRating: -1 }).limit(10);
    res.status(200).json(topRatedMovies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top-rated movies', error: error.message });
  }
};
