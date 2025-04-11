const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes'); // Import movie routes
const wishlistRoutes = require('./routes/wishlistRoutes'); // Import wishlist routes
const reviewRoutes = require('./routes/reviewRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes'); // Import recommendation routes
const listRoutes = require('./routes/listRoutes'); // Import list routes
const upcomingRoutes = require('./routes/upcomingRoutes'); // Ensure this is imported
const discussionRoutes = require('./routes/discussionRoutes'); // Import discussion routes
const adminRoutes = require('./routes/adminRoutes');
const cron = require('node-cron');
const cors = require('cors');
const { sendNotifications } = require('./controllers/upcomingController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Connect to the database
connectDB();

// Initialize the app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Create 'uploads' folder if it doesn't exist
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Serve static files from 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/discussions', discussionRoutes); // Use discussion routes
app.use('/api/upcoming', upcomingRoutes); // Ensure this is correct
// Use the admin routes
app.use('/api/admin', adminRoutes);

// Cron job to send notifications every day at 8 AM
cron.schedule('0 8 * * *', async () => {
  try {
    await sendNotifications(); // Ensure sendNotifications is awaited if it returns a Promise
    console.log('Notification job executed at 8 AM');
  } catch (error) {
    console.error('Error running notification job:', error.message);
  }
});

// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
