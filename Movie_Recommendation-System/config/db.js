require('dotenv').config(); // Make sure this is at the top
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Debugging line to check if the MONGO_URI is being read correctly
    console.log('MONGO_URI:', process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected to MoviesSystem...');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
