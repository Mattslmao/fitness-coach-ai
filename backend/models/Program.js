const mongoose = require('mongoose');

const ProgramSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['training', 'nutrition', 'combined'],
    required: true
  },
  fitnessGoal: String,
  training: {
    plan: String,
    frequency: Number, // workouts per week
    duration: Number, // weeks
    workouts: [{
      day: String,
      type: String,
      exercises: [{
        name: String,
        sets: Number,
        reps: String,
        rest: Number,
        notes: String,
        videoUrl: String
      }]
    }]
  },
  nutrition: {
    calories: Number,
    macros: {
      protein: Number,
      carbs: Number,
      fats: Number
    },
    meals: [{
      name: String,
      time: String,
      foods: [{
        name: String,
        amount: String,
        calories: Number,
        protein: Number,
        carbs: Number,
        fats: Number,
        barcode: String
      }],
      instructions: String
    }],
    mealPlan: [{
      day: String,
      meals: [String]
    }]
  },
  startDate: Date,
  endDate: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Program', ProgramSchema);