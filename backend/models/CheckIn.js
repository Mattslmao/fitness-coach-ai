const mongoose = require('mongoose');

const CheckInSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  week: Number,
  date: {
    type: Date,
    required: true
  },
  weight: Number,
  photos: {
    front: String,
    side: String,
    back: String
  },
  measurements: {
    chest: Number,
    waist: Number,
    hips: Number,
    arms: Number,
    thighs: Number
  },
  questions: {
    trainingDays: Number,
    missedMeals: Number,
    mentalEnergy: {
      type: Number,
      min: 1,
      max: 10
    },
    physicalEnergy: {
      type: Number,
      min: 1,
      max: 10
    },
    sleepQuality: {
      type: Number,
      min: 1,
      max: 10
    },
    stressLevel: {
      type: Number,
      min: 1,
      max: 10
    },
    notes: String,
    challenges: String
  },
  aiRecommendations: {
    summary: String,
    calorieAdjustment: Number,
    macroAdjustments: {
      protein: Number,
      carbs: Number,
      fats: Number
    },
    trainingAdjustment: String,
    motivationalMessage: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CheckIn', CheckInSchema);