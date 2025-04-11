const Movie = require('../models/movieModel');
const Reminder = require('../models/reminderModel');
const nodemailer = require('nodemailer'); // For email notifications

// Get upcoming movies
exports.getUpcomingMovies = async (req, res) => {
  try {
    const upcomingMovies = await Movie.find({ upcoming: true, releaseDate: { $gte: new Date() } });
    res.status(200).json(upcomingMovies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching upcoming movies', error: error.message });
  }
};

// Set a reminder for a movie
exports.setReminder = async (req, res) => {
  try {
    const { movieId, reminderDate, notificationType } = req.body;
    const userId = req.user.id;

    const reminder = new Reminder({
      user: userId,
      movie: movieId,
      reminderDate,
      notificationType,
    });

    await reminder.save();
    res.status(201).json({ message: 'Reminder set successfully', reminder });
  } catch (error) {
    res.status(500).json({ message: 'Error setting reminder', error: error.message });
  }
};

// Send notifications
exports.sendNotifications = async () => {
  try {
    const currentDate = new Date();
    const reminders = await Reminder.find({ reminderDate: { $lte: currentDate } }).populate('user').populate('movie');

    for (const reminder of reminders) {
      if (reminder.notificationType === 'email') {
        // Send email notification
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: reminder.user.email,
          subject: `Reminder: Upcoming Movie Release - ${reminder.movie.title}`,
          text: `Don't miss the upcoming release of ${reminder.movie.title} on ${reminder.movie.releaseDate.toDateString()}!`,
        };

        await transporter.sendMail(mailOptions);
      } else {
        // Dashboard notification logic (to be implemented based on your frontend)
        console.log(`Dashboard notification sent to user ${reminder.user._id} for movie ${reminder.movie.title}`);
      }

      // Remove sent reminder
      await Reminder.findByIdAndDelete(reminder._id);
    }
  } catch (error) {
    console.error('Error sending notifications:', error.message);
  }
};
