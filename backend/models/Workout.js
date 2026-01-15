const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  programId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program'
  },
  date: {
    type: Date,
    required: true
  },
  type: String,
  duration: Number, // minutes
  exercises: [{
    name: String,
    sets: [{
      reps: Number,
      weight: Number,
      completed: Boolean
    }],
    formVideoUrl: String, // Premium feature
    formAnalysis: String // AI analysis - Premium feature
  }],
  notes: String,
  caloriesBurned: Number,
  completed: {
    type: Boolean,
    default: false
  },
  rating: Number, // 1-5
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Workout', WorkoutSchema);