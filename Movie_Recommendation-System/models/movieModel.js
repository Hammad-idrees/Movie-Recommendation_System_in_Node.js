const mongoose = require('mongoose');

// Schema for reviews
const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Schema for news and articles related to movies
const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
  },
  publicationDate: {
    type: Date,
    default: Date.now,
  },
});

// Schema for awards and nominations
const awardSchema = new mongoose.Schema({
  awardName: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
  },
  result: {
    type: String, // e.g., "Won" or "Nominated"
  },
});

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  genre: {
    type: [String], // Array of genres
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  cast: {
    type: [String], // Array of cast members
    required: true,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  runtime: {
    type: Number, // Runtime in minutes
    required: true,
  },
  synopsis: {
    type: String,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  popularity: {
    type: Number,
    default: 0,
  },
  coverPhotoUrl: {
    type: String,
  },
  trivia: {
    type: [String],
  },
  goofs: {
    type: [String],
  },
  soundtrack: {
    type: [String],
  },
  actorProfiles: [
    {
      name: String,
      biography: String,
      filmography: [String],
      awards: [String],
      photos: [String],
    },
  ],
  ageRating: {
    type: String,
    required: true,
  },
  parentalGuidance: {
    type: String,
  },
  country: {
    type: String,
  },
  language: {
    type: String,
  },
  keywords: {
    type: [String],
  },
  trailerUrl: {
    type: String, // URL for the trailer
  },
  boxOffice: {
    openingWeekend: {
      type: Number, // Revenue in USD or local currency
    },
    totalEarnings: {
      type: Number, // Total revenue in USD or local currency
    },
    internationalRevenue: {
      type: Number, // Revenue from international markets
    },
  },
  budget: {
    type: Number, // Optional: Budget of the movie
  },
  productionCompany: {
    type: String, // Optional: Production company of the movie
  },
  filmingLocations: {
    type: [String], // Optional: Array of filming locations
  },
  reviews: [reviewSchema],
  upcoming: {
    type: Boolean,
    default: false, // Indicates if the movie is an upcoming release
  },
  articles: [articleSchema], // Array of articles related to the movie
  awards: [awardSchema], // Array of awards and nominations
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

movieSchema.pre('save', function (next) {
  // Ensure that upcoming remains true if set
  if (this.releaseDate && this.releaseDate > new Date()) {
    this.upcoming = true; // Enforce upcoming to remain true if the release date is in the future
  }
  next();
});

module.exports = mongoose.model('Movie', movieSchema);