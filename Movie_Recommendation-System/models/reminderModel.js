const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  reminderDate: { type: Date, required: true },
  notificationType: { type: String, enum: ['email', 'dashboard'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema);
