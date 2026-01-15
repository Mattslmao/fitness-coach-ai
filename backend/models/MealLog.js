const mongoose = require('mongoose');

const MealLogSchema = new mongoose.Schema({
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
  meals: [{
    mealType: String, // breakfast, lunch, dinner, snack
    time: Date,
    foods: [{
      name: String,
      amount: String,
      calories: Number,
      protein: Number,
      carbs: Number,
      fats: Number,
      barcode: String
    }],
    photo: String
  }],
  totalCalories: Number,
  totalProtein: Number,
  totalCarbs: Number,
  totalFats: Number,
  waterIntake: Number, // ml
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MealLog', MealLogSchema);