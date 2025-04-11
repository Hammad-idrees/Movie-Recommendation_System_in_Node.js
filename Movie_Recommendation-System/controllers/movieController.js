const Movie = require('../models/movieModel');
const User = require('../models/userModel'); // Add this line to import the User model
const Review = require('../models/reviewModel'); // Optional: If you need to use the Review model

// Add a new movie
exports.addMovie = async (req, res) => {
  try {
    const {
      title,
      genre,
      director,
      cast,
      releaseDate,
      runtime,
      synopsis,
      coverPhotoUrl,
      trivia,
      goofs,
      soundtrack,
      actorProfiles,
      ageRating,
      parentalGuidance,
      country,
      language,
      keywords,
      trailerUrl,
      boxOffice,
      articles,
      awards
    } = req.body;

    const newMovie = new Movie({
      title,
      genre,
      director,
      cast,
      releaseDate,
      runtime,
      synopsis,
      coverPhotoUrl,
      trivia,
      goofs,
      soundtrack,
      actorProfiles,
      ageRating,
      parentalGuidance,
      country,
      language,
      keywords,
      trailerUrl,
      boxOffice,
      articles,
      awards,
    });

    // Ensure `upcoming` field is not overwritten and remains true if necessary
    if (newMovie.releaseDate && newMovie.releaseDate > new Date()) {
      newMovie.upcoming = true;
    }

    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
  } catch (error) {
    res.status(500).json({ message: 'Error adding movie', error: error.message });
  }
};

// Update a movie
exports.updateMovie = async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json(updatedMovie);
  } catch (error) {
    res.status(500).json({ message: 'Error updating movie', error: error.message });
  }
};

// Delete a movie
exports.deleteMovie = async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);

    if (!deletedMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting movie', error: error.message });
  }
};

// For Searhing

// Search for movies by title, genre, director, or cast
exports.searchMovies = async (req, res) => {
  try {
    const { query } = req.query;

    const movies = await Movie.find({
      $or: [
        { title: new RegExp(query, 'i') },
        { genre: { $in: [query] } },
        { director: new RegExp(query, 'i') },
        { cast: { $in: [query] } },
        { keywords: { $in: [query] } },
      ],
    });

    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error searching for movies', error: error.message });
  }
};

// Filter movies by ratings, popularity, and release year
exports.filterMovies = async (req, res) => {
  try {
    const { minRating, maxRating, minPopularity, releaseYear } = req.query;
    const filters = {};

    if (minRating) filters.averageRating = { $gte: Number(minRating) };
    if (maxRating) filters.averageRating = { ...filters.averageRating, $lte: Number(maxRating) };
    if (minPopularity) filters.popularity = { $gte: Number(minPopularity) };
    if (releaseYear) {
      filters.releaseDate = {
        $gte: new Date(`${releaseYear}-01-01`),
        $lte: new Date(`${releaseYear}-12-31`),
      };
    }

    const movies = await Movie.find(filters);
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error filtering movies', error: error.message });
  }
};

// Advanced filtering options for movies
exports.advancedFilterMovies = async (req, res) => {
  try {
    const { decade, country, language, keyword } = req.query;
    const filters = {};

    if (decade) {
      const startYear = parseInt(decade, 10);
      const endYear = startYear + 9;
      filters.releaseDate = {
        $gte: new Date(`${startYear}-01-01`),
        $lte: new Date(`${endYear}-12-31`),
      };
    }
    if (country) filters.country = new RegExp(country, 'i');
    if (language) filters.language = new RegExp(language, 'i');
    if (keyword) filters.keywords = { $in: [new RegExp(keyword, 'i')] };

    const movies = await Movie.find(filters);
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error with advanced filtering', error: error.message });
  }
};
// Remove the appropriate reviews
// Remove inappropriate review
exports.removeReview = async (req, res) => {
  try {
    const { movieId, reviewId } = req.params;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const reviewIndex = movie.reviews.findIndex(review => review._id.toString() === reviewId);
    if (reviewIndex === -1) {
      return res.status(404).json({ message: 'Review not found' });
    }

    movie.reviews.splice(reviewIndex, 1);
    await movie.save();

    res.status(200).json({ message: 'Review removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing review', error: error.message });
  }
};

exports.getInsights = async (req, res) => {
  try {
    // Fetch top 5 most popular movies based on average rating and popularity
    const popularMovies = await Movie.find()
      .sort({ averageRating: -1, popularity: -1 })
      .limit(5);

    // Fetch user activity using a lookup to the Review collection
    const userActivity = await Review.aggregate([
      {
        $group: {
          _id: '$user',
          reviewsCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'users', // The name of the User collection in MongoDB (use lowercase)
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $unwind: '$userDetails',
      },
      {
        $project: {
          _id: 1,
          username: '$userDetails.username',
          reviewsCount: 1,
          lastActive: '$userDetails.lastLoginDate', // Replace with the actual field for last activity
        },
      },
      {
        $sort: { reviewsCount: -1, lastActive: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    res.status(200).json({
      popularMovies,
      userActivity,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching insights', error: error.message });
  }
};
// In movieController.js
exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).populate('reviews');

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movie', error: error.message });
  }
};